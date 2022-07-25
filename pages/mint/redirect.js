import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import Loader from '../../components/Loader'
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
      <Landing>
        {isPreSaleOnline || isPublicSaleOnline ? (
          loading ? (
            <Section>
              <h2>Please wait a moment...</h2>
              <Loader />
            </Section>
          ) : (isPreSaleOnline && token && account) || isPublicSaleOnline ? (
            <MintPortal />
          ) : (
            <Section>You are not authorized!</Section>
          )
        ) : (
          <Section>Mint is offline!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
