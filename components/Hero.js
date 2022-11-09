import headerStyles from '../styles/Hero.module.css'

export default function  Hero () {
  return (
    <div className={headerStyles.main}>
        <div>
          <div>
            <h1 className={headerStyles.title}>
                Lend/
            </h1>
            <h1 className={headerStyles.title}>
                Collaterls/
            </h1>
            <h1 className={headerStyles.title}>
                Dao
            </h1>
          </div>
          <div>
            <img/>
          </div>
        </div>
        <p className={headerStyles.description}>
        Unleash the Value of Your NFTs
        </p>
        <p className={headerStyles.description1}>
        Borrow up to 40% of the value of your BAYC or CryptoPunks without selling them.
        </p>
        <button className={headerStyles.start}>
        Get Started</button>
        
    </div>
  )
}