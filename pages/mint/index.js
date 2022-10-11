import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMint } from '../../contexts/MintContext'
import { useDiscord } from '../../contexts/DiscordContext'
import useWallet from '../../contexts/WalletContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Home/Landing'
import Section from '../../components/Section'
import BaseButton from '../../components/BaseButton'
import GlobalLoader from '../../components/Loader/GlobalLoader'
import SubmitWallet from '../../components/Mint/SubmitWallet'
import ConnectWallet from '../../components/ConnectWallet'
import MintPortal from '../../components/Mint/MintPortal'
import Discord from '../../icons/Discord'
import { DISCORD_AUTH_REDIRECT_URL } from '../../constants/discord'

export default function Page() {
  const router = useRouter()
  const { isRegisterOnline, isPreSaleOnline, isPublicSaleOnline } = useMint()
  const { loading, account, getAccount } = useDiscord()
  const { connected, populatedWallet } = useWallet()

  useEffect(() => {
    if (isRegisterOnline && !account) {
      ;(async () => {
        await getAccount()
      })()
    }
  }, [isRegisterOnline, account])

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {!isRegisterOnline && !isPreSaleOnline && !isPublicSaleOnline ? (
          <Section>
            Wallet registration is offline, pre-sale is offline, public sale is offline, you shouldn't be here
            right now :)
          </Section>
        ) : loading ? (
          <GlobalLoader />
        ) : isRegisterOnline ? (
          !account ? (
            <Section>
              <h2>Login with Discord</h2>
              <p>Login to view, register, or change your wallet address for the upcoming pre-sale</p>
              <BaseButton
                label='Authorize'
                onClick={() => router.push(DISCORD_AUTH_REDIRECT_URL)}
                icon={Discord}
                backgroundColor='var(--discord-purple)'
                style={{ width: '100%' }}
              />
            </Section>
          ) : (
            <SubmitWallet />
          )
        ) : isPreSaleOnline ? (
          !connected ? (
            <ConnectWallet
              modalOnly
              introText='Connect a wallet to verify your whitelisted wallet address and participate in the pre-sale of this collection.'
            />
          ) : (
            <MintPortal populatedWallet={populatedWallet} />
          )
        ) : isPublicSaleOnline ? (
          <MintPortal />
        ) : null}
      </Landing>
      <Footer />
    </div>
  )
}
