import secondStyles from '../styles/second.module.css'

export default function Second() {
  return (
    <div className={secondStyles.main}>
        <div className={secondStyles.first}>
             <div className={secondStyles.image}>
                <img src="img5.jpg" alt="vrfnorn"/>
            </div>
            <div>
                <h1 className={secondStyles.title}>
                    Lenders
                </h1>
                <h2 className={secondStyles.two}>
                    Receive wETH or DAI without selling your NFT

                </h2>
                <p className={secondStyles.description}> 
                List your NFT as collateral and get loan offers from our users. Once you accept an offer, you receive wETH or DAI liquidity from the lender's wallet into yours. Your NFT gets transferred into a double-audited escrow smart contract for the loan duration. Repay the loan before it expires, and you get your NFT back. If you default, the lender can foreclose and receive your NFT. There are no auto-liquidations on NFTfi.

                Yes, unlocking value from your NFT is that simple. What are you going to use the liquidity for? Earning yield on a money market? Completing your NFT collection? Treating yourself IRL?
                </p>
            </div>
            <div>
            </div>
        </div>
        <div className={secondStyles.third}>
            <div>
                <h1 className={secondStyles.title}>
                    Collateral
                </h1>   
                <h2 className={secondStyles.two}>
                    Receive wETH or DAI without selling your NFT

                </h2>
                <p className={secondStyles.description}>                    
                Browse over 150 NFT collections (including CryptoPunks, Bored Apes, Art Blocks, Mutant Apes, VeeFriends, Autoglyphs, and most other bluechips) and offer loans on the assets you’re happy to back.
‍
                Best case, you earn a juicy APR. "Worst case", the borrower defaults and you walk away with an NFT at a hefty discount. Some lenders even specialize in "loan-to-own" strategies. 

                No matter if you loan to earn or loan to own, make sure you connect to the NFTfi expert lender community and deeply understand the NFTs you lend against.
                </p>
            </div>
            <div className={secondStyles.image}>
                <img src="img1.jpg" alt="vrfnorn"/>
            </div>
        </div>
    </div>
  )
}
