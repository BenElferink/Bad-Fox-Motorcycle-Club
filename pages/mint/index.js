import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDiscord } from '../../contexts/DiscordContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import DiscordLogin from '../../components/DiscordAuth/Login'
import { DISCORD_REDIRECT_URL_MINT } from '../../constants/discord'

export default function Page() {
  const router = useRouter()
  const { account } = useDiscord()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_MINT)
  }

  const isOkToSkipAuth = (isPreSaleOnline && account) || isPublicSaleOnline

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
        {isPreSaleOnline ? (
          <DiscordLogin
            title='Login with Discord'
            text='Login to participate in the pre-sale, and mint your CNFTs'
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
