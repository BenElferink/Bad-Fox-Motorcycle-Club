import { useRouter } from 'next/router'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import DiscordLogin from '../../components/DiscordLogin'
import { DISCORD_REDIRECT_URL_MINT } from '../../constants/discord'

export default function Register() {
  const router = useRouter()
  const { token, member } = useDiscordAuth()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_MINT)
  }

  if (token && member) {
    router.push('/mint/redirect')

    return <div className='App' />
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <DiscordLogin title='Mint your NFTs' text='Login with your Discord account to mint your NFTs.' onClick={clickLogin} />
      </Landing>
      <Footer />
    </div>
  )
}
