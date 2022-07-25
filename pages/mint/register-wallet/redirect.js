import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useMint } from '../../../contexts/MintContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import Section from '../../../components/Section'
import Loader from '../../../components/Loader'
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
      <Landing>
        {isRegisterOnline ? (
          loading ? (
            <Section>
              <h2>Please wait a moment...</h2>
              <Loader />
            </Section>
          ) : token && account ? (
            <SubmitWallet />
          ) : (
            <Section>You are not authorized!</Section>
          )
        ) : (
          <Section>Wallet registration is closed!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
