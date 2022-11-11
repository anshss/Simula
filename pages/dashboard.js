// import { contractAddress } from "../address/Collateral.js"
import styles from '../styles/collateral.module.css'; 
import CollateralContractAbi from "../artifacts/contracts/Collateral.sol/Collateral.json";
import LendingContractAbi from "../artifacts/contracts/Lending.sol/Lending.json";
import web3modal from "web3modal"; 
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";

export default function Dashboard() {

    const [uri, setUri] = useState({collateral: "", lending: ""})
    const [claimed, setClaimed] = useState(false)

    useEffect(() => {
        fetchLendingStake()
        fetchCollateralStake()
    }, [])

    const LendingContract = "0xB86bd49525ccCFdC2e37e483df033172daD3b4c3";
    const CollateralContract = "0xB86bd49525ccCFdC2e37e483df033172daD3b4c3";

    const uriAbi = [
        {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              }
            ],
            "name": "tokenURI",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    async function fetchAccount() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            return account
          }
    }

    const getSignerOrProvider = async (needSigner = false) => {
        const modal = new web3modal()
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        if(needSigner){
            const signer = provider.getSigner()
            return signer
        }
        return provider
    }
    
    async function fetchCollateralStake() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        const user = await fetchAccount()
        const stake = await contract.userToStake(user)
        const parsedData = {
            contractAdd: stake.contractAdd,
            tokenId: stake.tokenId,
        }
        console.log(parsedData)
        const nftcontract = new ethers.Contract(parsedData.contractAdd, uriAbi, signer)
        const uriHere = await nftcontract.tokenURI(parsedData.tokenId)
        console.log(uri)
        setUri({...uri, collateral: uriHere})
    }

    function CardCollateral() {
        return (
            <div className={styles.card}>
                <img src={uri.collateral} />
                <button onClick={claimCollateral}> Claim </button>
                <button onClick={unstakeCollateral}> Unstake </button>
            </div>
        )
    }

    async function claimCollateral() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        const txn = await contract.claim()
        await txn.wait()
        setClaimed(true)
    }

    const tokenAddress = "0x75AD3a6F05f4Af07803C4fC83ddB9cB5D721bA05"
    const approveAbi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
     
    async function unstakeCollateral() {
        const signer = await getSignerOrProvider(true)
        const tokenContract = new ethers.Contract(tokenAddress, approveAbi, signer)
        const value = '1'
        const parseValue = ethers.utils.parseUnits(value, "ether");
        const approve = tokenContract.approve(CollateralContract, parseValue)
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        const txn = await contract.unstake()
        await txn.wait()
    }


    async function fetchLendingStake() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(LendingContract, LendingContractAbi.abi, signer)
        const user = await fetchAccount()
        const stake = await contract.userToStake(user)
        const parsedData = {
            contractAdd: stake.contractAdd,
            tokenId: stake.tokenId,
        }
        console.log(parsedData)
        const nftcontract = new ethers.Contract(parsedData.contractAdd, uriAbi, signer)
        const uriHere = await nftcontract.tokenURI(parsedData.tokenId)
        console.log(uri)
        setUri({...uri, collateral: uriHere})
    }

    function CardLending() {
        return (
            <div className={styles.card}>
                <img src={uri.collateral} />
                <button onClick={claimLending}> Claim </button>
                <button onClick={unstakeLending}> Unstake </button>
            </div>
        )
    }

    async function claimLending() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(LendingContract, LendingContractAbi.abi, signer)
        const txn = await contract.claim()
        await txn.wait()
        setClaimed(true)
    }

    async function unstakeLending() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(LendingContract, LendingContractAbi.abi, signer)
        const txn = await contract.unstake()
        await txn.wait()
    }

    return (
        <div>
            <Nav />
            <div>Collateral</div>
            <CardCollateral />
            <div>Lending</div>
            <CardLending />
        </div>
    )
}