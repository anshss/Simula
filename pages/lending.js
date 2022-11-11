import styles from '../styles/collateral.module.css'
import { useEffect, useState } from 'react'
import Moralis from 'moralis'
const { EvmChain } = require('@moralisweb3/evm-utils')
import Nav from '../components/Nav'
import { contractAddress } from "../address/Collateral.js";
import contractAbi from '../artifacts/contracts/Collateral.sol/Collateral.json'
import web3modal from 'web3modal'
import { ethers } from 'ethers'

export default function Lending() {
  const contractAddress = '0x114B55744c7b88F6af2606284b051C6Ec9B778e4'
  const [nfts, setNfts] = useState([])
  const [data, setData] = useState({ value: '', term: '' })

  useEffect(() => {
    fetch()
  }, [])

  async function fetch() {
    await Moralis.start({
      apiKey:
        'ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY',
      // ...and any other configuration
    })

    const address = '0x45609e1289a42216a90c9c3454D44b4915652e00'
    const chain = EvmChain.MUMBAI

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    })

    console.log(response.data.result)
    setNfts(response.data.result)
  }
  const nftabi = [{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}]

  async function Collateral(prop) {
    const modal = new web3modal()
    const connection = await modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const nftAddress = prop.tokenContract
    const nftcontract = new ethers.Contract(
      nftAddress.toString(),
      nftabi,
      signer)
    const txn = await nftcontract.approve(contractAddress, prop.tokenId)
    const value = '1'
    const term = '10'
    const parseValue = ethers.utils.parseUnits(value, "ether");
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      signer)
    const data = await contract.deposit(
      prop.tokenContract,
      prop.tokenId,
      parseValue,
      term)
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
            name="value"
            placeholder="Value"
            required
            onChange={(e) => setData({ ...data, value: e.target.value })}
          />
          <input
            name="term"
            placeholder="Term (weeks)"
            required
            onChange={(e) => setData({ ...data, term: e.target.value })}
          />
        </div>
        <button className={styles.cltrlbutton} onClick={() => Collateral(prop)}>
          Lending
        </button>
      </div>
    )
  }

return (
  <div className={styles.container}>
    <Nav />
    <h2>Lend your Nfts and get 7% each month</h2>
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
