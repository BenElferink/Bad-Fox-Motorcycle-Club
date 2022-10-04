import { useEffect } from 'react'
import { useDiscord } from '../../../contexts/DiscordContext'
import { useMint } from '../../../contexts/MintContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Home/Landing'
import Section from '../../../components/Section'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import SubmitWallet from '../../../components/Mint/SubmitWallet'

export default function Page() {
  const { loading, account, getAccount } = useDiscord()
  const { isRegisterOnline } = useMint()

  useEffect(() => {
    if (!account && isRegisterOnline) {
      ;(async () => {
        await getAccount()
      })()
    }
  }, [account, isRegisterOnline])

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {isRegisterOnline ? (
          loading ? (
            <DiscordFetchingAccount />
          ) : account ? (
            <SubmitWallet />
          ) : (
            <DiscordNotAuthorized />
          )
        ) : (
          <Section>Wallet registration is closed!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
