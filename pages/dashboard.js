// import { contractAddress } from "../address/Collateral.js"
import styles from '../styles/dashboard.module.css'; 
import CollateralContractAbi from "../artifacts/contracts/Collateral.sol/Collateral.json";
import LendingContractAbi from "../artifacts/contracts/Lending.sol/Lending.json";
import web3modal from "web3modal"; 
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { useRouter } from 'next/router';

export default function Dashboard() {

    const [uri, setUri] = useState({collateral: "", lending: ""})
    const [claimed, setClaimed] = useState(false)
    const [collateralClaimed, setCollateralClaimed] = useState(false)
    const [lendingClaimed, setLendingClaimed] = useState(false)

    useEffect(() => {
        fetchLendingStake()
        fetchCollateralStake()
        hasClaimedCollateral()
        claimTime()
    }, [])

    const LendingContract = "0x114B55744c7b88F6af2606284b051C6Ec9B778e4";
    const CollateralContract = "0x5d5B63B926fD5767C3b4a53CF12C09907a6A7dF2";
    const CollateralFundsContract = "0xEEe6e5f99AA223CD3A7B1abD1331C9567e9Bc9EF";
    const tokenAddress = "0xFA31614f5F776eDD6f72Bc00BdEb22Bd4A59A7Db" //usdt

    const router = useRouter()

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


    // ----------------------- Collateral
    
    async function fetchCollateralStake() {
        try{
            const signer = await getSignerOrProvider(true)
            const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
            const user = await fetchAccount()
            const stake = await contract.userToStake(user)
            const parsedData = {
                contractAdd: stake.contractAdd,
                tokenId: stake.tokenId,
            }
            console.log(parsedData)
            if (parsedData.tokenId == null) return
            const nftcontract = new ethers.Contract(parsedData.contractAdd, uriAbi, signer)
            const id = parsedData.tokenId
            const uriHere = await nftcontract.tokenURI(id.toNumber())
            console.log(uriHere)
            setUri({...uri, collateral: uriHere})
        } catch (error) {
            console.log(error)
        }
    }

    async function claimCollateral() {
        const signer = await getSignerOrProvider(true)
        // const provider = new ethers.providers.JsonRpcProvider(`https://stylish-dark-violet.matic-testnet.discover.quiknode.pro/d935f45044efc89c96e437b0774f40b074c7816e/`)
        const provider = await getSignerOrProvider()
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        const user = await fetchAccount()
        const gasPrice = await provider.getFeeData();
        const gas = ethers.utils.formatUnits(gasPrice.gasPrice, "wei");
        const transaction = {
            from: user,
            gasPrice: gas,
            gasLimit: "1000000",
            // maxFeePerGas: "300",
            // maxPriorityFeePerGas: "10",
          };
        const txn = await contract.claim()
        hasClaimedCollateral()
    }

    async function hasClaimedCollateral() {
        const provider = await getSignerOrProvider()
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, provider)
        const user = await fetchAccount()
        const txn = await contract.hasClaimed(user)
        setCollateralClaimed(txn)
    }

    
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
        const contract = new ethers.Contract(CollateralContract, CollateralContractAbi.abi, signer)
        // const parseValue = ethers.utils.parseEther("1000");
        const nftValue = await contract.fetchNftValue()
        const approve = await tokenContract.approve(CollateralFundsContract, nftValue)
        const provider = await getSignerOrProvider()
        const user = await fetchAccount()
        const gasPrice = await provider.getFeeData();
        const gas = ethers.utils.formatUnits(gasPrice.gasPrice, "wei");
        const transaction = {
            from: user,
            gasPrice: gas,
            gasLimit: "100000",
            maxFeePerGas: "300",
            maxPriorityFeePerGas: "10",
        };
        const txn = await contract.unstake()
        await approve.wait()
        await txn.wait()
        router.push("/collateral")
    }

    function CardCollateral() {
        return (
            <div className={styles.col}>
                {uri.collateral ?
                <div className={styles.card}>
                    <img src={uri.collateral} />
                    <div className={styles.bb}>
                        {collateralClaimed ? <button onClick={claimCollateral} disabled> Claimed </button> : 
                        <button onClick={claimCollateral}> Claim </button>}
                        <button onClick={unstakeCollateral}> Unstake </button>
                    </div>
                </div> : null
                }
            </div>
        )
    }


    // ----------------------- Lending

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
            if (parsedData.tokenId) return
            const nftcontract = new ethers.Contract(parsedData.contractAdd, uriAbi, signer)
            const uriHere = await nftcontract.tokenURI(parsedData.tokenId)
            console.log(uri)
            setUri({...uri, lending: uriHere})
            
        } catch (error) {
            console.log(error)
        }
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

    async function claimTime() {
        const signer = await getSignerOrProvider(true)
        const contract = new ethers.Contract(LendingContract, LendingContractAbi.abi, signer)
        const txn = await contract.claimTime()
        setLendingClaimed(txn)
    }

    function CardLending() {
        return (
                <div className={styles.len}> 
                { uri.lending &&
                    <div className={styles.card}>
                        <img src={uri.lending} />
                        <div className={styles.bb}>
                            {lendingClaimed ? <button onClick={claimLending} disabled> Claimed </button> : 
                            <button onClick={claimLending}> Claim </button>}
                            <button onClick={unstakeLending}> Unstake </button>
                        </div>
                    </div> }
                </div> 
        )
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

