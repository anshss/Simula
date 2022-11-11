// import { contractAddress } from "../address/Dao.js"; 
import styles from '../styles/dao.module.css'
import contractAbi from "../artifacts/contracts/Dao.sol/Dao.json";
import web3modal from "web3modal"; 
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Nav from "../components/Nav"

export default function Dao() {

    const DaoContract = "0x665b75D5B4D700394194B853df346dDd701416aD"

    useEffect(() => {
        // fetchAllProposal()
    }, [])

    const [proposals, setProposals] = useState([])
    const[proposalData, setProposalData] = useState({
        contractAdd: "",
        tokenId: "",
        description: "",
        destination: ""
    })
    const [numProposals, setNumProposals] = useState("0");
    const [isMember, setIsMember] = useState(false)

    async function getContract() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(DaoContract, contractAbi.abi, signer)
        return contract
    }

    async function handleJoinDao() {
        const contract = getContract()
        const price = ethers.utils.parseUnits("1", "ether")
        const txn = await contract.joinDao({value: price})
        await txn.wait()
        setIsMember(true)
    }

    async function handleLeaveDao() {
        const contract = getContract()
        const txn = await contract.leaveDao()
        await txn.wait()
        setIsMember(false)
    }

    
    async function createProposal() {
        const contract = getContract()
        const txn = await contract.createProposal(proposalData.contractAdd, proposalData.tokenId, proposalData.destination, proposalData.description)
        await txn.wait()
    }

    async function getNumProposalsInDAO() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider)
        const daoNumProposals = await contract.numProposal();
        setNumProposals(daoNumProposals.toString());
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
        const numProposals = getNumProposalsInDAO()
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
        
        <div className={styles.container}>
        <Nav/>
        { isMember ?  <button className={styles.join}  onClick={handleLeaveDao}>Leave Dao</button> :  <button className={styles.join} onClick={handleJoinDao}>Join Dao</button>}        
            <div className={styles.in}> 
                <input name="contractAdd" placeholder="Contract address" required onChange={(e) => setProposalData({...proposalData, contractAdd: e.target.value,})}/>
                <input name="tokenId" placeholder="TokenId" required onChange={(e) => setProposalData({...proposalData, tokenId: e.target.value,})}/>
                <input name="description" placeholder="Description" required onChange={(e) => setProposalData({...proposalData, description: e.target.value,})}/>
                <input name="destination" placeholder="Receiver address" required onChange={(e) => setProposalData({...proposalData, destination: e.target.value,})}/>
                <button onClick={createProposal}>Propose</button>
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