// import { contractAddress } from "../address/Dao.js"; 
import styles from '../styles/dao.module.css'
import contractAbi from "../artifacts/contracts/Dao.sol/Dao.json";
import web3modal from "web3modal"; 
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Nav from "../components/Nav"


export default function Dao() {

    const DaoContract = "0xE335FCd03D0917dA02062C814F647763943D1918"
    const LendingContract = "0xF8d68cE9910D3217cF74e70B2B62FE4cCE260285"

    useEffect(() => {
        fetchAllProposal()
        fetchNfts()
    }, [])

    const[proposalData, setProposalData] = useState({
        contractAdd: "",
        tokenId: "",
        description: "",
        destination: ""
    })
    const [proposals, setProposals] = useState([])
    const [isMember, setIsMember] = useState(false)
    const [lendingNfts, setLendingNfts] = useState([])
    const [selectedTab, setSelectedTab] = useState("View Proposal")


    async function getContract() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(DaoContract, contractAbi.abi, signer)
        return contract
    }

    async function handleJoinDao() {
        const contract = await getContract()
        const price = ethers.utils.parseUnits("1", "ether")
        const txn = await contract.joinDao({value: price})
        await txn.wait()
        setIsMember(true)
    }

    async function handleLeaveDao() {
        const contract = await getContract()
        const txn = await contract.leaveDao()
        await txn.wait()
        setIsMember(false)
    }

    
    async function createProposal() {
        const contract = await getContract()
        const txn = await contract.createProposal(proposalData.contractAdd, proposalData.tokenId, proposalData.destination, proposalData.description)
        await txn.wait()
    }

    async function getNumProposalsInDAO() {
        const contract = await getContract()
        const daoNumProposals = await contract.numProposal();
        // setNumProposals(daoNumProposals.toString());
        return daoNumProposals
    }
    
    async function fetchProposalById(id) {
        const contract = await getContract()
        const proposal = await contract.idToProposal(id)
        const parsedProposal = {
            proposalId: id,
            contractAdd: proposal.contractAdd.toString(),
            nftTokenId: proposal.tokenId.toString(),
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
        const numProposals = await getNumProposalsInDAO()
        for (let i = 0; i < numProposals; i++) {
          const proposal = await fetchProposalById(i);
          proposals.push(proposal);
        }
        setProposals(proposals);
    }


    async function voteProposal(proposalId, _vote) {
        const contract = await getContract()
        let vote = _vote === "YAY" ? 0 : 1;
        const txn = await contract.voteOnProposal(proposalId, vote);
        await txn.wait();
        await fetchAllProposal();
    }

    async function executeProposal() {
        const contract = await getContract()
        const txn = await contract.executeProposal(proposalId);
        await txn.wait();
        await fetchAllProposal();
    }


    function ProposalCard(prop) {
        return (
            <div className={styles.card}>
                {/* <img src={uri} /> */}
                <div className={styles.subdiv}>
                    <h4>address: {prop.tokenContract}</h4>
                    <h4>tokenId: {prop.tokenId}</h4>
                    <div className={styles.cardbtns}>
                        <button onClick={styles.yay} className={styles.cardbtn}> yay </button>
                        <button onClick={styles.nay} className={styles.cardbtn}> nay </button>
                        <button onClick={executeProposal} className={styles.cardbtn}> Execute </button>
                    </div>
                </div>
            </div>
        )}

    function NftCard(prop) {
        return (
            <div className={styles.card}>
                {/* <img src={uri} /> */}
                <div className={styles.subdiv}>
                    <h4>address: {prop.tokenContract}</h4>
                    <h4>tokenId: {prop.tokenId}</h4>
                </div>
            </div>
        )
    }


    function renderProposal() {
        return(
            <>
            {proposals.map((item, i) => (
                <ProposalCard
                    key={i}
                    tokenId={item.nftTokenId}
                    tokenContract={item.contractAdd}
                    desciption={item.desciption}
                    executed={item.executed}
                    deadline={item.deadline}
                    yay={item.yayVotes}
                    nay={item.nayVotes}
                />
            ))}
            </>
        )
    }

    const fetchNftsAbi = [
        {
            "inputs": [],
            "name": "fetchAllNfts",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "contractAdd",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "term",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct Lending.Stake[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
    ]
    
    async function fetchNfts() {
        try{
            const modal = new web3modal(); 
            const connection = await modal.connect()
            const provider = new ethers.providers.Web3Provider(connection) 
            const signer = provider.getSigner()
            const contract = new ethers.Contract(LendingContract, fetchNftsAbi, signer)
            const stake = await contract.fetchAllNfts()
            console.log(stake)

            const items = await Promise.all(
                stake.map(async (i) => {
                    console.log(i[0])
                    let parsedData = {
                        contractAdd: i[0],
                        tokenId: i[1].toNumber(),
                    }
                    return parsedData;
                })
            );

            console.log(items)
            setLendingNfts(items)
        } catch (error) {
            console.log(error)
        }
    }

    function renderNfts() {
        return(
            <>
                {lendingNfts.map((nft, i) => (
                    <NftCard
                    key={i}
                    // uri={nft.token_uri}
                    tokenContract={nft.contractAdd}
                    tokenId={nft.tokenId}
                    />
                ))}
            </>
        )
    }

    function rendertabs() {
        if (selectedTab === "View Proposal") {
            return renderProposal();
        } else if (selectedTab === "View Nfts") {
            return renderNfts();
        }
        return null;
    }



    return(
        <>
        <Nav/>
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.btndiv}>
                    { isMember ?  <button className={styles.btn}  onClick={handleLeaveDao}>Leave Dao</button> :  <button className={styles.btn} onClick={handleJoinDao}>Join Dao</button>}        
                    <button className={styles.btn} onClick={() => setSelectedTab("View Proposal")} >Show proposal</button>
                    <button className={styles.btn} onClick={() => setSelectedTab("View Nfts")} >Show Nfts</button>
                </div>
                <div className={styles.in}> 
                    <input name="contractAdd" placeholder="Contract address" required onChange={(e) => setProposalData({...proposalData, contractAdd: e.target.value,})}/>
                    <input name="tokenId" placeholder="TokenId" required onChange={(e) => setProposalData({...proposalData, tokenId: e.target.value,})}/>
                    <input name="description" placeholder="Description" required onChange={(e) => setProposalData({...proposalData, description: e.target.value,})}/>
                    <input name="destination" placeholder="Receiver address" required onChange={(e) => setProposalData({...proposalData, destination: e.target.value,})}/>
                    <button onClick={createProposal}>Propose</button>
                </div>
            </div>
            <div className={styles.card}>
            {rendertabs()}
            </div>
        </div>
        </>
    )
}