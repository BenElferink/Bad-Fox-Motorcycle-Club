import { useRouter } from 'next/router'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import DiscordLogin from '../../components/DiscordLogin'
import { DISCORD_REDIRECT_URL_REGISTRATION_CHECK } from '../../constants/discord'

export default function RegistrationCheck() {
  const router = useRouter()
  const { isRegisterOnline } = useMint()
  const { token, member } = useDiscordAuth()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_REGISTRATION_CHECK)
  }

  if (isRegisterOnline && token && member) {
    router.push('/registration-check/redirect')

    return <div className='App' />
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <DiscordLogin
          title='Check Your Wallet Address'
          text='Login with your Discord account to check your registered wallet address.'
          onClick={clickLogin}
        />
      </Landing>
      <Footer />
    </div>
  )
}
