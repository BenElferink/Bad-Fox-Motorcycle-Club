import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Footer from '../../../components/Footer'
import Header from '../../../components/Header'
import Landing from '../../../components/Landing'
import DiscordLogin from '../../../components/DiscordAuth/Login'
import { DISCORD_AUTH_URL_MY_WALLET_TRAITS } from '../../../constants/discord'

const Page = () => {
  const router = useRouter()
  const { token, account } = useAuth()

  const clickLogin = () => {
    router.push(DISCORD_AUTH_URL_MY_WALLET_TRAITS)
  }

  const isOkToSkipAuth = token && account

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
          text='You need to authorize yourself in order to view your traits'
          onClick={clickLogin}
        />
      </Landing>
      <Footer />
    </div>
  )
}

export default Page
