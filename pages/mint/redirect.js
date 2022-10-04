import { useEffect } from 'react'
import { useDiscord } from '../../contexts/DiscordContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Home/Landing'
import Section from '../../components/Section'
import DiscordFetchingAccount from '../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../components/DiscordAuth/NotAuthorized'
import MintPortal from '../../components/Mint/MintPortal'

export default function Page() {
  const { loading, account, getAccount } = useDiscord()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

  useEffect(() => {
    if (!account && isPreSaleOnline) {
      ;(async () => {
        await getAccount()
      })()
    }
  }, [account, isPreSaleOnline])

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {isPreSaleOnline || isPublicSaleOnline ? (
          loading ? (
            <DiscordFetchingAccount />
          ) : (isPreSaleOnline && account) || isPublicSaleOnline ? (
            <MintPortal />
          ) : (
            <DiscordNotAuthorized />
          )
        ) : (
          <Section>Mint is offline!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
