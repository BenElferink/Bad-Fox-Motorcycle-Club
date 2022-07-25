import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useMint } from '../../../contexts/MintContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import DiscordLogin from '../../../components/DiscordLogin'
import { DISCORD_REDIRECT_URL_WALLET_CHECK } from '../../../constants/discord'

export default function Page() {
  const router = useRouter()
  const { isRegisterOnline } = useMint()
  const { token, account } = useAuth()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_WALLET_CHECK)
  }

  const isOkToRedirect = isRegisterOnline && token && account

  useEffect(() => {
    if (isOkToRedirect) {
      router.push(`${router.asPath}/redirect`)
    }
  }, [isOkToRedirect])

  if (isOkToRedirect) {
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
