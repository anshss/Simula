//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Lending is ERC721Holder, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _counter;

    uint256 totalAmount = 0;

    struct Stake {
        address contractAdd;
        uint256 tokenId;
        address owner;
        uint256 timestamp;
        uint256 value;
        uint256 term;
    }

    event staked(address owner, address contractAdd, uint256 tokenId, uint256 value, uint256 _term);
    event unstaked(address owner, address contractAdd, uint256 tokenId, uint256 value, uint256 _term);
    event claimed(address owner, uint256 amount);

    mapping (address => Stake) public userToStake;
    mapping (address => uint256) public lastClaimed;
    mapping (uint256 => Stake) public allNfts;


    function stake(address _contract, uint256 _tokenId, uint256 _value, uint _term) public {
        IERC721 currentNft = IERC721(_contract);

        require(currentNft.ownerOf(_tokenId) == msg.sender, "only owner of token can deposit");
        // require(_term >= 4 * 604800); // term should be atleast 1 month
        // require(_term <= 32 * 604800); // term should be less than 4 months
        currentNft.safeTransferFrom(msg.sender, address(this), _tokenId);
        // userToStake[msg.sender] = Stake(_contract, _tokenId, payable(msg.sender), block.timestamp, _value, _term) * 604800;
        userToStake[msg.sender] = Stake(_contract, _tokenId, payable(msg.sender), block.timestamp, _value, _term);
        lastClaimed[msg.sender] = 0;
        _counter.increment();
        allNfts[_counter.current()] = userToStake[msg.sender];
        emit staked(msg.sender, _contract, _tokenId, _value, _term);
        totalAmount += _value;
    }

    function unstake() public {
        Stake memory crtStake = userToStake[msg.sender];  //current stake
        require(block.timestamp - crtStake.timestamp >= crtStake.term, "stake duration not over yet");
        IERC721 currentNft = IERC721(crtStake.contractAdd);
        currentNft.safeTransferFrom(address(this), msg.sender, crtStake.tokenId);
        delete crtStake;
        delete lastClaimed[msg.sender];
        emit unstaked(msg.sender, crtStake.contractAdd, crtStake.tokenId, crtStake.value, crtStake.term);
    }

    function claim() public {
        require(block.timestamp - lastClaimed[msg.sender]  >= 4*604800, "can only claim once per 4 weeks");
        Stake memory crtStake = userToStake[msg.sender];
        uint256 earned = (7 * crtStake.value) / 100;
        transferFunds(msg.sender, earned);
        lastClaimed[msg.sender] = block.timestamp;
        emit claimed(msg.sender, earned);
    }

    function claimTime() public view returns(bool) {
        if(lastClaimed[msg.sender] - block.timestamp >= 4*604800){
            return true;
        }
        else{
            return false;
        }
    }

    function fetchAllNfts() public view returns(Stake[] memory) {
        Stake[] memory nftArray = new Stake[](_counter.current());
        uint counter = 0;

        for (uint i=0; i<_counter.current(); i++) {
            Stake storage currentItem = allNfts[i+1];
            nftArray[counter] = currentItem;
            counter++;
        }
        return nftArray;
    }

    function fetchStake() public view returns(Stake memory) {
        return userToStake[msg.sender];
    }

    function fetchAmount() public view returns(uint256) {
        return totalAmount;
    }

    function transferFunds(address user, uint256 amount) private {
        payable(user).transfer(amount);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}

    fallback() external payable {}

}