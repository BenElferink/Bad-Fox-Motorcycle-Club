import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import Section from '../../../components/Section'
import Loader from '../../../components/Loader'
import CheckWallet from '../../../components/Mint/CheckWallet'

export default function Page() {
  const { loading, token, account, getAccountWithDiscordToken } = useAuth()

  useEffect(() => {
    ;(async () => {
      await getAccountWithDiscordToken()
    })()
  }, [])

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {loading ? (
          <Section>
            <h2>Please wait a moment...</h2>
            <Loader />
          </Section>
        ) : token && account ? (
          <CheckWallet />
        ) : (
          <Section>You are not authorized!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
