import headerStyles from '../styles/Hero.module.css'

export default function  Hero () {
  return (
    <div className={headerStyles.main}>
        <div className={headerStyles.section}>
          <div>
            <h1 className={headerStyles.title}>
                Lend/
            </h1>
            <h1 className={headerStyles.title}>
                Collateral/
            </h1>
            <h1 className={headerStyles.title}>
                Dao
            </h1>
          </div>
          <div className={headerStyles.image}>
            <img src="img4.png"/>
          </div>
        </div>
        <p className={headerStyles.description}>
        Unleash the Value of Your NFTs
        </p>
        <p className={headerStyles.description1}>
        Borrow up to 40% of the value of your BAYC or CryptoPunks without selling them.
        </p>
        <button className={headerStyles.start}>
        Get Started </button>
        
    </div>
  )
}