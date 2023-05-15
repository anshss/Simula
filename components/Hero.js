import headerStyles from '../styles/Hero.module.css'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className={headerStyles.main}>
      <div className={headerStyles.text}>
        <div className={headerStyles.section}>
          <div>
            <h1 className={headerStyles.title}>Lending/</h1>
            <h1 className={headerStyles.title}>Collateral/</h1>
            <h1 className={headerStyles.title}>Dao</h1>
          </div>
        </div>
        <p className={headerStyles.description}>Unleash the Value of Your NFTs</p>
        <p className={headerStyles.description1}>Borrow up to 40% of the value of your BAYC or CryptoPunks without selling them.</p>
        <p className={headerStyles.description1}>Or lend them to us to earn regular interest</p>
        <Link href='/collateral'><button className={headerStyles.start}>Get Started</button></Link>
      </div>
      <div className={headerStyles.image}>
        <img src="creepz.png"/>
      </div>
    </div>
      
  )
}