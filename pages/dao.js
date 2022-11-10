// import styles from '../styles/dao.module.css'
// import { contractAddress } from "../address/Collateral.js"; 
import contractAbi from "../artifacts/contracts/Collateral.sol/Collateral.json";
import web3modal from "web3modal"; 
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Dao() {

    useEffect(() => {
        fetchAllProposal()
    }, [])

    const [proposals, setProposals] = useState([])
    const[proposalData, setProposalData] = useState({
        contractAdd: "",
        tokenId: "",
        description: "",
        destination: ""
    })

    async function getContract() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer)
        return contract
    }

    async function joinDao() {
        const contract = getContract()
        const price = ethers.utils.parseUnits(1, "ether");
        const txn = await contract.joinDao({value: price})
        await txn.wait()
    }

    async function createProposal() {
        const contract = getContract()
        const txn = await contract.createProposal(nftContract, tokenId, address, description)
        await txn.wait()
    }
    
    async function fetchProposalById(id) {
        const contract = getContract()
        const proposal = await contract.idToProposal(id)
        const parsedProposal = {
            proposalId: id,
            nftTokenId: proposal.nftTokenId.toString(),
            desciption: proposal.desciption,
            deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
            yayVotes: proposal.yayVotes.toString(),
            nayVotes: proposal.nayVotes.toString(),
            executed: proposal.executed,
          };
          return parsedProposal;
    }

    async function fetchAllProposal() {
        const proposals = [];
        for (let i = 0; i < numProposals; i++) {
          const proposal = await fetchProposalById(i);
          proposals.push(proposal);
        }
        setProposals(proposals);
    }


    async function voteProposal(proposalId, _vote) {
        const contract = getContract()
        let vote = _vote === "YAY" ? 0 : 1;
        const txn = await contract.voteOnProposal(proposalId, vote);
        await txn.wait();
        await fetchAllProposal();
    }

    async function executeProposal() {
        const contract = getContract()
        const txn = await contract.executeProposal(proposalId);
        await txn.wait();
        await fetchAllProposal();
    }

    return(
        <div>
            <button onClick={joinDao}>Join Dao</button>
            <div>
                <input name="contractAdd" placeholder="contractAdd" required onChange={(e) => setProposalData({...proposalData, contractAdd: e.target.value,})}/>
                <input name="tokenId" placeholder="tokenId" required onChange={(e) => setProposalData({...proposalData, tokenId: e.target.value,})}/>
                <input name="description" placeholder="description" required onChange={(e) => setProposalData({...proposalData, description: e.target.value,})}/>
                <input name="destination" placeholder="destination" required onChange={(e) => setProposalData({...proposalData, destination: e.target.value,})}/>
                <button onClick={createProposal}>Propose !</button>
            </div>
            <div>
            {proposals.map((item, i) => (
                <div>
                    {i}
                    {item.cover}
                    {item.tokenId}
                </div>
            ))}
            </div>
        </div>
    )
}