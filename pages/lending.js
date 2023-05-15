import styles from '../styles/collateral.module.css'
import { useEffect, useState } from 'react'
import Moralis from 'moralis'
import Nav from '../components/Nav'
// import { LendingContract } from '../address/Lending.js'
import { LendingContract } from '../config-address'
// import contractAbi from '../artifacts/contracts/Lending.sol/Lending.json'
import { LendingAbi } from '../config-abi'
import web3modal from 'web3modal'
import { ethers } from 'ethers'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Web3Storage } from 'web3.storage'
import { saveAs } from "file-saver";
import { Card } from '../components/CardLending'

export default function Lending() {

  const contractAddress = LendingContract
  const contractAbi = LendingAbi

  const [nfts, setNfts] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetchAccount().then((user) => fetch(user))
  }, [])

  async function fetchAccount() {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      // setUser(account)
      return account
    }
  }

  async function fetch(user) {
    await Moralis.start({
      apiKey:
        process.env.MORALIS_API_KEY,
    })

    const options = {
      method: 'GET',
      url: `https://deep-index.moralis.io/api/v2/${user}/nft`,
      params: { chain: 'mumbai', format: 'hex', normalizeMetadata: 'false' },
      headers: {
        accept: 'application/json',
        'X-API-Key':
          'ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY',
      },
    }

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.result)
        setNfts(response.data.result)
      })
      .catch(function (error) {
        console.error(error)
      })
  }

  const nftabi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  async function Lending(prop) {
    const modal = new web3modal()
    const connection = await modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const nftAddress = prop.tokenContract
    const nftcontract = new ethers.Contract(
      nftAddress.toString(),
      nftabi,
      signer,
    )
    const approve = await nftcontract.approve(contractAddress, prop.tokenId)
    const valueString = dataInput.value
    const parseValue = ethers.utils.parseUnits(valueString , 'ether')
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer,
    )
    const txn = await contract.stake(
      prop.tokenContract,
      prop.tokenId,
      parseValue,
      dataInput.term,
    )
    await receipt(
      prop.tokenContract,
      prop.tokenId,
      dataInput.term,
      dataInput.value,
      )
      await approve.wait()
      await txn.wait()
      // router.push('/dashboard')
      fetch()
  }

    // -------------receipt

    function getAccessToken() {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQ4NzhFNjQ1NkUwYzUyYzE2RDI5ODI0MWUzNzA1MWY0NDgyM2Q1MTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjM2MTU3ODEyMTksIm5hbWUiOiJGb3IgbXkgcHJvamVjdCJ9.4p3tWCPEz4FA9kO9M6-JvrNVyQorsVWXCvJ89ByoWx4'
    }
  
    function makeStorageClient() {
      return new Web3Storage({ token: getAccessToken() })
    }
  
    const uploadToIPFS = async (files) => {
      const client = makeStorageClient()
      const cid = await client.put(files)
      return cid
    }
  
    async function receipt(nftContract, tokenId, term, value) {
      const data = JSON.stringify({
        nftContract: nftContract,
        tokenId: tokenId,
        term: term,
        value: value,
      })
      const files = [new File([data], 'data.json')]
      const metaCID = await uploadToIPFS(files)
      console.log(`https://ipfs.io/ipfs/${metaCID}/data.json`)
      const url =  `https://ipfs.io/ipfs/${metaCID}/data.json`
      Download('receipt.txt', url)
    }
  
    async function Download(_fileName, _fileUrl) {
      const name = _fileName;
      const fileUrl = _fileUrl;
      saveAs(fileUrl, name);
  }
  
    // -------------receipt

  if (nfts.length == 0) {
    return ( 
      <div className={styles.container}>
        <Nav />
        <h2>Lend to us, and get 7% each month</h2>
        <h1 className={styles.noNft}>No Nfts in your wallet</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Nav />
      <h2>Lend to us, and get 7% each month</h2>
      <div className={styles.images}>
        {nfts.map((nft, i) => (
          <Card
            key={i}
            uri={nft.token_uri}
            tokenContract={nft.token_address}
            tokenId={nft.token_id}
            Lending={Lending}
          />
        ))}
      </div>
    </div>
  )
}
