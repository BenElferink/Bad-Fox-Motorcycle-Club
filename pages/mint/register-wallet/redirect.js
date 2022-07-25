import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useMint } from '../../../contexts/MintContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import Section from '../../../components/Section'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import SubmitWallet from '../../../components/Mint/SubmitWallet'

export default function Page() {
  const { loading, token, account, getAccountWithDiscordToken } = useAuth()
  const { isRegisterOnline } = useMint()

  useEffect(() => {
    ;(async () => {
      if (isRegisterOnline) {
        await getAccountWithDiscordToken()
      }
    })()
  }, [isRegisterOnline])

  return (
    <div className='App flex-col'>
      <Header />
      {isRegisterOnline ? (
        loading && (!token || !account) ? (
          <DiscordFetchingAccount />
        ) : token && account ? (
          <Landing>
            <SubmitWallet />
          </Landing>
        ) : (
          <DiscordNotAuthorized />
        )
      ) : (
        <Landing>
          <Section>Wallet registration is closed!</Section>
        </Landing>
      )}
      <Footer />
    </div>
  )
}
