import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'
const Nav = () => {
    return (
      <nav className={navStyles.nav}>
        <ul>
            <li className={navStyles.one}>
                <Link href='/lending'>Lend</Link>
            </li>
            <li className={navStyles.two}>
                <Link href='/collateral'>Collateral</Link>
            </li>
             <li className={navStyles.three}>
                <Link href='/dao'>Dao</Link>
            </li>
            <button className={navStyles.login}>Login</button>
        </ul>
      </nav>
    )
  }

export default Nav
