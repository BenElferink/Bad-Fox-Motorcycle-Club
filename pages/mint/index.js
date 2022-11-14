import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Home/Landing'
import MintPortal from '../../components/MintPortal'

export default function Page() {
  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <MintPortal />
      </Landing>
      <Footer />
    </div>
  )
}
