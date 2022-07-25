import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useMint } from '../../../contexts/MintContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import DiscordLogin from '../../../components/DiscordAuth/Login'
import { DISCORD_AUTH_URL_CHECK_MINT_WALLET } from '../../../constants/discord'

export default function Page() {
  const router = useRouter()
  const { isRegisterOnline } = useMint()
  const { token, account } = useAuth()

  const clickLogin = () => {
    router.push(DISCORD_AUTH_URL_CHECK_MINT_WALLET)
  }

  const isOkToSkipAuth = isRegisterOnline && token && account

  useEffect(() => {
    if (isOkToSkipAuth) {
      router.push(`${router.asPath}/redirect`)
    }
  }, [isOkToSkipAuth])

  if (isOkToSkipAuth) {
    return <div className='App' />
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <DiscordLogin
          title='Login with Discord'
          text='Login to check your registered wallet address'
          onClick={clickLogin}
        />
      </Landing>
      <Footer />
    </div>
  )
}
