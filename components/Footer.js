import footerStyles from '../styles/footer.module.css'
import Link from 'next/link'

export default function footer() {
  return (
    <div className={footerStyles.main}>
        <h1>Simulaa</h1>
        <Link href='https://github.com/anshss/defining-Defi'><h4 className={footerStyles.heading}>View Code</h4></Link>
    </div>
  )
}
