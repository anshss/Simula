//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";


interface ICollateralFunds {
    function transferFunds(address user, uint256 amount) external;
    function returnFunds(address user) external payable;
}

contract Collateral is ERC721Holder {

    ICollateralFunds funds;
    
    constructor (address _collateralFunds) payable {
        funds = ICollateralFunds(_collateralFunds);
    }

    uint256 totalDeposits = 0;
    uint256 releaseAmount;

    struct Stake {
        address contractAdd;
        uint256 tokenId;
        address owner;
        uint256 timestamp;
        uint256 value;
        uint256 term ; //weeks
    }

    event staked(address owner, address contractAdd, uint256 tokenId, uint256 value, uint256 _term);
    event unstaked(address owner, address contractAdd, uint256 tokenId, uint256 value, uint256 _term);
    event claimed(address owner, uint256 amount);

    mapping (address => Stake) public userToStake;
    mapping (address => bool) public hasClaimed;


    function deposit(address _contract, uint256 _tokenId, uint256 _value, uint256 _term) public {
        IERC721 nftContract = IERC721(_contract);

        require(nftContract.ownerOf(_tokenId) == msg.sender, "only owner of token can deposit");
        // require(_term >= 4 * 604800); // term should be atleast 1 month
        // require(_term <= 32 * 604800); // term should be less than 4 months
        nftContract.safeTransferFrom(msg.sender, address(this), _tokenId);
        userToStake[msg.sender] = Stake(_contract, _tokenId, payable(msg.sender), block.timestamp, _value, _term ); // storing term as weeks as (* 604800)
        emit staked(msg.sender, _contract, _tokenId, _value, _term);
        totalDeposits += 1;
    }

    function claim() public {
        require(!hasClaimed[msg.sender]);
        funds.transferFunds(msg.sender, userToStake[msg.sender].value);
        hasClaimed[msg.sender] = true;
        emit claimed(msg.sender, userToStake[msg.sender].value);
    }


    function unstake() public payable {
        Stake memory crtStake = userToStake[msg.sender];
        require(block.timestamp - crtStake.timestamp >= crtStake.term, "term not over yet");
        funds.returnFunds(msg.sender);
        IERC721 currentNft = IERC721(crtStake.contractAdd);
        currentNft.safeTransferFrom(address(this), msg.sender, crtStake.tokenId);
        delete userToStake[msg.sender];
        delete hasClaimed[msg.sender];
        emit unstaked(msg.sender, crtStake.contractAdd, crtStake.tokenId, crtStake.value, crtStake.term);
    }

    function fetchNftValue() public view returns(uint256) {
        Stake memory crtStake = userToStake[msg.sender];
        return crtStake.value;
    }

    function fetchStake() public view returns(Stake memory) {
        return userToStake[msg.sender];
    }

    function fetchDepositAmount() public view returns(uint256) {
        return totalDeposits;
    }
    
}