import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import { useMint } from '../../contexts/MintContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import Loader from '../../components/Loader'
import SubmitWallet from '../../components/SubmitWallet'

export default function Redirect() {
  const router = useRouter()
  const { asPath } = router
  const { loading, token, member, getMemberWithToken } = useDiscordAuth()
  const { isRegisterOnline } = useMint()

  useEffect(() => {
    ;(async () => {
      if (asPath) {
        const query = asPath.split('#')[1]

        if (query) {
          let t = ''

          query.split('&').forEach((str) => {
            const [k, v] = str.split('=')
            if (k === 'access_token') t = v
          })

          await getMemberWithToken(t)
        }
      }
    })()
  }, [asPath])

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
          ) : token && member ? (
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
