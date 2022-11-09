import Head from 'next/head'
import Hero from '../components/Hero'
import Nav from '../components/Nav'
import Second from '../components/second'
import Footer from '../components/Footer'


export default function Home() {
  return (
    <div >
    <Nav/>
    <Hero />
    <Second/>
    <Footer/>
      
    </div>
  )
}