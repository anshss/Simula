// import styles from '../styles/'
import axios from 'axios';
import { useState } from 'react';
import Moralis from 'moralis';
const { EvmChain } = require("@moralisweb3/evm-utils");

export default function Collateral() {

  const [nfts, setNfts] = useState([])

  async function fetch() {
    await Moralis.start({
      apiKey: "ECu9sgtiXTgwMKEoJCg0xkjXfwm2R3NhOAATMBiTNIQoIzd7cAmeBibctzQyLkvY",
      // ...and any other configuration
    });

    const address = "0x74ec10C6F04E327B483701413103217EC15ccb2d";
    
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
        <div>
          <img src={prop.uri} />
        </div>
    )
}


    return (
      <div>
        <button onClick={fetch}>fetch</button>
      <div>
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