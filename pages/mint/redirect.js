import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import DiscordFetchingAccount from '../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../components/DiscordAuth/NotAuthorized'
import MintPortal from '../../components/Mint/MintPortal'

export default function Page() {
  const { loading, token, account, getAccountWithDiscordToken } = useAuth()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

  useEffect(() => {
    ;(async () => {
      if (isPreSaleOnline) {
        await getAccountWithDiscordToken()
      }
    })()
  }, [isPreSaleOnline])

  return (
    <div className='App flex-col'>
      <Header />
      {isPreSaleOnline || isPublicSaleOnline ? (
        loading && (!token || !account) ? (
          <DiscordFetchingAccount />
        ) : (isPreSaleOnline && token && account) || isPublicSaleOnline ? (
          <Landing>
            <MintPortal />
          </Landing>
        ) : (
          <DiscordNotAuthorized />
        )
      ) : (
        <Landing>
          <Section>Mint is offline!</Section>
        </Landing>
      )}
      <Footer />
    </div>
  )
}
