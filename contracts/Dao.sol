//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Dao is Ownable{


    address lendingContract;

    constructor(address _lendingContract) {
        lendingContract = _lendingContract;
    }

    uint256 joinStake = 1 ether;

    struct dao {
        address _address;
        bool isMember;
        uint256 timestamp;
    }

    mapping (address => dao) public daoMember;


    struct Proposal {
        address contractAdd;
        uint256 tokenId;
        string description;
        uint256 yayVotes;
        uint256 nayVotes;
        uint256 deadline;
        bool executed;
        address destination;
        mapping(address => bool) voted;
    }

    mapping(uint256 => Proposal) public idToProposal;
    uint256 public numProposal;

    enum Vote {
        yay,
        nay
    }

    function joinDao() public payable {
        require(msg.value == joinStake, "Stake amount should be equal to as specified");
        daoMember[msg.sender] = dao(msg.sender, true, block.timestamp);
    }

    function leaveDao() public payable {
        dao memory member = daoMember[msg.sender];
        require(member.timestamp > 4 weeks, "You cannot leave before 1 month");
        payable(member._address).transfer(joinStake);
        delete member;
    }


    modifier onlyDaoMember {
        require(daoMember[msg.sender].isMember);
        _;
    }

    function createProposal(address _contract, uint256 _tokenId, address _destination, string memory _description) public onlyDaoMember returns(uint256) {
        numProposal++;
        Proposal storage proposal = idToProposal[numProposal];
        proposal.contractAdd = _contract;
        proposal.tokenId = _tokenId;
        proposal.deadline = block.timestamp + 1 days;
        proposal.destination = _destination;
        proposal.description = _description;
        return numProposal;
    }
    
    function voteProposal(uint256 proposalId, Vote vote) public onlyDaoMember {
        Proposal storage proposal = idToProposal[proposalId];
        require(idToProposal[proposalId].deadline > block.timestamp, "deadline exceeded");
        require(!proposal.voted[msg.sender], "user already voted");
        if(vote == Vote.yay) {
            proposal.yayVotes++;
        }
        else {
            proposal.nayVotes;
        }
        proposal.voted[msg.sender] = true;
    }
    
    function executeProposal(uint256 proposalId) public onlyDaoMember {
        require(idToProposal[proposalId].deadline <= block.timestamp, "deadline exceeded");
        require(!idToProposal[proposalId].executed, "proposal already executed");
        address _contractAdd = idToProposal[numProposal].contractAdd;
        uint256 _tokenId = idToProposal[numProposal].tokenId;
        address _destination = idToProposal[numProposal].destination;
        IERC721 currentNft = IERC721(_contractAdd);
        currentNft.safeTransferFrom(lendingContract, _destination, _tokenId);
        idToProposal[numProposal].executed = true;
    }


    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}

}