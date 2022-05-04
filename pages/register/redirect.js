import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import SubmitWallet from '../../components/SubmitWallet'

export default function Redirect() {
  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <SubmitWallet />
      </Landing>
      <Footer />
    </div>
  )
}
