import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'
import SignIn from './signin.jsx'

const Nav = () => {
    return (
      <nav className={navStyles.nav}>
        <ul>
            <li>
                <Link href='/'><h2>Simulaa</h2></Link>
            </li>
        </ul>
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
            <li className={navStyles.three}>
                <Link href='/dashboard'>Dashboard</Link>
            </li>
            <button className={navStyles.login}><SignIn /></button>
            
        </ul>
      </nav>
    )
  }

export default Nav
