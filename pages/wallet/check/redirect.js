import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDiscordAuth } from '../../../contexts/DiscordAuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import Section from '../../../components/Section'
import Loader from '../../../components/Loader'
import ViewSubmittedWallet from '../../../components/ViewSubmittedWallet'

export default function CheckWalletRedirect() {
  const router = useRouter()
  const { asPath } = router
  const { loading, token, member, getDiscordTokenFromQuery, getMemberWithToken } = useDiscordAuth()

  useEffect(() => {
    ;(async () => {
      if (asPath) {
        const query = asPath.split('#')[1]
        const t = getDiscordTokenFromQuery(query)
        await getMemberWithToken(t)
      }
    })()
  }, [asPath])

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {loading ? (
          <Section>
            <h2>Please wait a moment...</h2>
            <Loader />
          </Section>
        ) : token && member ? (
          <ViewSubmittedWallet />
        ) : (
          <Section>You are not authorized!</Section>
        )}
      </Landing>
      <Footer />
    </div>
  )
}
