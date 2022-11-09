import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'
const Nav = () => {
    return (
      <nav className={navStyles.nav}>
        <ul>
            <li>
                <Link href='/'>Lend</Link>
            </li>
            <li>
                <Link href='/about'>Collateral</Link>
            </li>
            <li>
                <Link href='/about'>Dao</Link>
            </li>
            <button>Login</button>
        </ul>
      </nav>
    )
  }

export default Nav
