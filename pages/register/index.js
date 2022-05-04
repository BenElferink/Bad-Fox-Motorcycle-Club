import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import DiscordLogin from '../../components/DiscordLogin'

export default function Register() {
  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <DiscordLogin />
      </Landing>
      <Footer />
    </div>
  )
}
