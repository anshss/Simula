import styles from '../styles/collateral.module.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Moralis from 'moralis';
const { EvmChain } = require("@moralisweb3/evm-utils");
import Nav from '../components/Nav'

export default function Collateral() {

  const [nfts, setNfts] = useState([])
  useEffect(() => {
    fetch()
  }, [])

  async function fetch() {
    await Moralis.start({
      apiKey: "ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY",
      // ...and any other configuration
    });

    const address = "0x45609e1289a42216a90c9c3454D44b4915652e00";
    
    const chain = EvmChain.MUMBAI;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
       address,
       chain,
    });

    console.log(response.data.result);
    setNfts(response.data.result);

  }

  function Card(prop) {
    return (
        <div className={styles.card}>
          <img src={prop.uri} />
          <button className={styles.bb}> Lending </button>
        </div>
    )
}


    return (
      <div className={styles.container}>
        <Nav />
        <h2>Lend your Nfts at 7%</h2>
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