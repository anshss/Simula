// import styles from '../styles/dao.module.css'
// import { contractAddress } from "../address/Collateral.js"; 
import contractAbi from "../artifacts/contracts/Collateral.sol/Collateral.json";
import web3modal from "web3modal"; 
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Dashboard() {

    const [lendingStake, setLendingStake] = useState()
    const [collateralStake, setCollateralStake] = useState()

    useEffect(() => {
        fetchLendingStake()
        fetchCollateralStake()
    }, [])

    const LendingContract = "0xx";
    const CollateralContract = "0xx";

    async function getLendingContract() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LendingContract, contractAbi.abi, signer)
        return contract
    }

    async function getCollateralContract() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CollateralContract, contractAbi.abi, signer)
        return contract
    }

    async function fetchLendingStake() {
        const contract = getLendingContract()
        const stake = await contract.fetchStake()
        const parsedData = {
            contractAdd: stake.contractAdd,
            tokenId: stake.tokenId,
        }
        setLendingStake(parsedData)
    }

    async function fetchCollateralStake() {
        const contract = getCollateralContract()
        const stake = await contract.fetchStake()
        const parsedData = {
            contractAdd: stake.contractAdd,
            tokenId: stake.tokenId,
        }
        setCollateralStake(parsedData)
    }
    
    async function claimLending() {
        const contract = getLendingContract()
        const txn = await contract.claim()
        await txn.wait()
    }

    async function claimCollateral() {
        const contract = getCollateralContract()
        const txn = await contract.claim()
        await txn.wait()
    }

    async function unstakeLending() {
        const contract = getLendingContract()
        const txn = await contract.unstake()
        await txn.wait()
    }
     
    async function unstakeCollateral() {
        const contract = getCollateralContract()
        const txn = await contract.unstake()
        await txn.wait()
    }

    async function CardCollateral() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(collateralStake.contractAdd, contractAbi.abi, signer)
        const uri = await contract.uri(collateralStake.tokenId)
        return (
            <div className={styles.card}>
                <img src={uri} />
                <button onClick={claimCollateral}> Claim </button>
                <button onClick={unstakeCollateral}> Unstake </button>
            </div>
        )
    }

    async function CardLending() {
        const modal = new web3modal(); 
        const connection = await modal.connect()
        const provider = new ethers.providers.Web3Provider(connection) 
        const signer = provider.getSigner()
        const contract = new ethers.Contract(lendingStake.contractAdd, contractAbi.abi, signer)
        const uri = await contract.uri(lendingStake.tokenId)
        return (
            <div className={styles.card}>
                <img src={uri}/>
                <button onClick={claimLending}> Claim </button>
                <button onClick={unstakeLending}> Unstake </button>
            </div>
        )
    }

    return (
        <div>
            <div>Collateral</div>
            <CardCollateral />
            <div>Lending</div>
            <CardLending />
        </div>
    )
}