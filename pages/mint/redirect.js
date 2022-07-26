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
  const { loading, account, getAccount } = useAuth()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

  useEffect(() => {
    ;(async () => {
      if (isPreSaleOnline) {
        await getAccount()
      }
    })()
  }, [isPreSaleOnline])

  return (
    <div className='App flex-col'>
      <Header />
      {isPreSaleOnline || isPublicSaleOnline ? (
        loading ? (
          <DiscordFetchingAccount />
        ) : (isPreSaleOnline && account) || isPublicSaleOnline ? (
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
