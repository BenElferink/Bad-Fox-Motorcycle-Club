import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDiscord } from '../../../contexts/DiscordContext'
import { useMint } from '../../../contexts/MintContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import Section from '../../../components/Section'
import DiscordLogin from '../../../components/DiscordAuth/Login'
import { DISCORD_AUTH_URL_REGISTER_MINT_WALLET } from '../../../constants/discord'

export default function Page() {
  const router = useRouter()
  const { isRegisterOnline } = useMint()
  const { account } = useDiscord()

  const clickLogin = () => {
    router.push(DISCORD_AUTH_URL_REGISTER_MINT_WALLET)
  }

  const isOkToSkipAuth = isRegisterOnline && account

  useEffect(() => {
    if (isOkToSkipAuth) {
      router.push(`${router.route}/redirect`)
    }
  }, [isOkToSkipAuth])

  if (isOkToSkipAuth) {
    return <div className='App' />
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {isRegisterOnline ? (
          <DiscordLogin
            title='Login with Discord'
            text='Login to register your wallet address'
            onClick={clickLogin}
          />
        ) : (
          <Section>Wallet registration is closed!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
