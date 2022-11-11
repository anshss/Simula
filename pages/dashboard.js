// import { contractAddress } from "../address/Collateral.js"
import styles from '../styles/dashboard.module.css'; 
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

    const LendingContract = "0x114B55744c7b88F6af2606284b051C6Ec9B778e4";
    const CollateralContract = "0x68865C713E7b107B25A72D5fc4714683bFb282FC";

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
        try {
            
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
            const id = parsedData.tokenId
            const uriHere = await nftcontract.tokenURI(id.toNumber())
            console.log(uri)
            setUri({...uri, collateral: uriHere})
        } catch (error) {
            console.log(error)
        }
    }

    function CardCollateral() {
        return (
                <div className={styles.col}>
                    <div className={styles.card}>
                       { uri ? <img src={uri.collateral} /> : null}
                        <div className={styles.bb}>
                            {claimed ? <button onClick={claimCollateral} disabled> Claimed </button> : 
                        <button onClick={claimCollateral}> Claim </button>}
                        <button onClick={unstakeCollateral}> Unstake </button>
                        </div>
                    </div>
                </div>
        )
    }

    async function claimCollateral() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        const txn = await contract.claim({gasLimit: 1200000})
        await txn.wait()
        setClaimed(true)
    }

    const tokenAddress = "0x75AD3a6F05f4Af07803C4fC83ddB9cB5D721bA05" //usdt
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
        const parseValue = ethers.utils.parseUnits('1000', "ether");
        const approve = tokenContract.approve(CollateralContract, parseValue)
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        const txn = await contract.unstake()
        await txn.wait()
    }


    async function fetchLendingStake() {
        try {
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
            setUri({...uri, lending: uriHere})
            
        } catch (error) {
            console.log(error)
        }
    }

    function CardLending() {
        return (
                <div className={styles.len}> 
                {uri ?
                    <div className={styles.card}>
                        <img src={uri.lending} />
                        <div className={styles.bb}>
                            {claimed ? <button onClick={claimLending} disabled> Claimed </button> : 
                            <button onClick={claimLending}> Claim </button>}
                            <button onClick={unstakeLending}> Unstake </button>
                        </div>
                    </div> : null }
                </div> 
        )
    }

    async function claimLending() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(LendingContract, LendingContractAbi.abi, signer)
        const txn = await contract.claim({gasLimit: 1200000})
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
            <div className={styles.container}>
                <div>
                    <h2 className={styles.heading}>Collateral</h2>
                    <CardCollateral/>
                </div>
                <div>
                    <h2 className={styles.heading}>Lending</h2>
                    <CardLending/>
                </div>
            </div>
        </div>
    )
}

