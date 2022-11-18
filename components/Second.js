import secondStyles from '../styles/second.module.css'

export default function Second() {
  return (
    <div className={secondStyles.main}>
      <div className={secondStyles.first}>
        <div className={secondStyles.image}>
          <img src="img5.jpg" alt="vrfnorn" />
        </div>
        <div>
          <h1 className={secondStyles.title}>Lending</h1>
          <h2 className={secondStyles.two}>
            Get regular interest on your NFT
          </h2>
          <p className={secondStyles.description}>
            Lend us your owned NFT and receive a regular monthly 4% to 7%
            interest. Once you hit the button, your NFT gets transferred into a
            smart contract. A DAO will now be able to access your NFT. It will
            be performing some businesses like renting your NFT to an exhibition
            or a user and yielding interest in it. It will cover the 7% provided
            to you and eventually try to earn more than that. The extra earnings
            of DAO will be divided among its members. A user can become a DAO
            member by stake 5 Matic. After your Lending duration expires, your
            NFT will be returned to you.
          </p>
        </div>
      </div>
      <div className={secondStyles.third}>
        <div>
          <h1 className={secondStyles.title}>Collateral</h1>
          <h2 className={secondStyles.two}>
            Deposit NFT to take some USDT
          </h2>
          <p className={secondStyles.description}>
            List your NFT as collateral and get a loan up to 40% of NFT value
            from us in USDT. Once you hit the button, your NFT gets transferred
            into a escrow smart contract for the loan duration. Repay the loan
            after the duration with 4% interest in a duration of 1 month. If you
            default, our Dao can foreclose your NFT. Collateral duration can
            vary between 1 month to 4 months. This time period is decided to
            avoid NFT fluctuations. For the same reason, the amount is given in
            USDT.
          </p>
        </div>
        <div className={secondStyles.image}>
          <img src="img1.jpg" alt="vrfnorn" />
        </div>
      </div>
    </div>
  )
}
