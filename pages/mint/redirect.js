import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import Loader from '../../components/Loader'
import MintPortal from '../../components/MintPortal'

export default function Redirect() {
  const router = useRouter()
  const { asPath } = router
  const { loading, token, member, getDiscordTokenFromQuery, getMemberWithToken } = useDiscordAuth()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

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
        {isPreSaleOnline || isPublicSaleOnline ? (
          loading ? (
            <Section>
              <h2>Please wait a moment...</h2>
              <Loader />
            </Section>
          ) : (isPreSaleOnline && token && member) || isPublicSaleOnline ? (
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
