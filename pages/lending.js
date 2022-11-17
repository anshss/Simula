import styles from '../styles/collateral.module.css'
import { useEffect, useState } from 'react'
import Moralis from 'moralis'
import Nav from '../components/Nav'
import { contractAddress } from '../address/Lending.js'
import contractAbi from '../artifacts/contracts/Lending.sol/Lending.json'
import web3modal from 'web3modal'
import { ethers } from 'ethers'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Lending() {
  const contractAddress = "0x19690Bc3578270654cD89D65cb2779Cf51779C56"

  const [nfts, setNfts] = useState([])
  const [dataInput, setData] = useState({ 
    value: "", 
    term: "" 
  })

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
      contractAbi.abi,
      signer,
    )
    const txn = await contract.stake(
      prop.tokenContract,
      prop.tokenId,
      parseValue,
      dataInput.term,
    )
    await approve.wait()
    await txn.wait()
    router.push("/dashboard")
    // fetch()
  }

  function Card(prop) {
    return (
      <div className={styles.card}>
        <img src={prop.uri} />
        <div className={styles.inpbutton}>
          <input
            name="Value"
            placeholder="Value (Matic)"
            required
            value={dataInput.value}
            onChange={(e) => setData({ ...dataInput, value: e.target.value,})}
          />
          <input
            name="Term"
            placeholder="Term (weeks)"
            required
            value={dataInput.term}
            onChange={(e) => setData({ ...dataInput, term: e.target.value, })}
          />
        </div>
        <button className={styles.cltrlbutton} onClick={() => Lending(prop)}>
        Lending
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Nav />
      <h2>Get 7% each month</h2>
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
