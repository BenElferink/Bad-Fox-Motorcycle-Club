import { useRouter } from 'next/router'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import DiscordLogin from '../../components/DiscordLogin'
import { DISCORD_REDIRECT_URL_REGISTER } from '../../constants/discord'
import { REGISTER_ONLINE } from '../../constants/booleans'

export default function Register() {
  const router = useRouter()
  const { token, member } = useDiscordAuth()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_REGISTER)
  }

  if (token && member) {
    router.push('/register/redirect')

    return <div className='App' />
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {REGISTER_ONLINE ? (
          <DiscordLogin title='Register for Mint' text='Login with your Discord account to submit your wallet address.' onClick={clickLogin} />
        ) : (
          <Section>Wallet registration is closed!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
