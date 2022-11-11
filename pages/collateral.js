import styles from '../styles/collateral.module.css'
import { useEffect, useState } from 'react'
import Moralis from 'moralis'
const { EvmChain } = require('@moralisweb3/evm-utils')
import Nav from '../components/Nav'
import { contractAddress } from '../address/Collateral.js'
import contractAbi from '../artifacts/contracts/Collateral.sol/Collateral.json'
import web3modal from 'web3modal'
import { ethers } from 'ethers'
import axios from 'axios'

export default function Collateral() {
  const contractAddress = '0x73A604e60d98775a90CB0ca1F229e0DA96E7D83C'

  const [nfts, setNfts] = useState([])
  const [dataInput, setData] = useState({ value: "4", term: "2" })

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
        'ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY',
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

  async function Collateral(prop) {
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
    const txn = await nftcontract.approve(contractAddress, prop.tokenId)
    const parseValue = ethers.utils.parseUnits(dataInput.value, 'ether')
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      signer,
    )
    const data = await contract.deposit(
      prop.tokenContract,
      prop.tokenId,
      parseValue,
      dataInput.term,
    )
    await txn.wait()
    await data.wait()
    fetch()
  }

  function Card(prop) {
    return (
      <div className={styles.card}>
        <img src={prop.uri} />
        <div className={styles.inpbutton}>
          <input
            name="Value"
            placeholder="Value"
            required
            onChange={(e) => setData({ ...dataInput, value: e.target.value })}
          />
          <input
            name="Term"
            placeholder="Term (weeks)"
            required
            onChange={(e) => setData({ ...dataInput, term: e.target.value })}
          />
        </div>
        <button className={styles.cltrlbutton} onClick={() => Collateral(prop)}>
          Collateral
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Nav />
      <h2>Lock your Nfts and get 40% of value</h2>
      <div className={styles.images}>
        {nfts.map((nft, i) => (
          <Card
            key={i}
            uri={nft.token_uri}
            tokenContract={nft.token_address}
            tokenId={nft.token_id}
          />
        ))}
      </div>
    </div>
  )
}
