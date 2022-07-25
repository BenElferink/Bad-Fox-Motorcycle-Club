import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import DiscordLogin from '../../components/DiscordLogin'
import MintPortal from '../../components/Mint/MintPortal'
import { DISCORD_REDIRECT_URL_MINT } from '../../constants/discord'

export default function Page() {
  const router = useRouter()
  const { token, account } = useAuth()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_MINT)
  }

  if (isPublicSaleOnline) {
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

  if (isPreSaleOnline && token && account) {
    router.push(`${router.asPath}/redirect`)

    return <div className='App' />
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {isPreSaleOnline ? (
          <DiscordLogin
            title='Mint your NFTs'
            text='Login with your Discord account to mint your NFTs.'
            onClick={clickLogin}
          />
        ) : (
          <Section>Mint is offline!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
