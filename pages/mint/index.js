import { useMint } from '../../contexts/MintContext'
import useWallet from '../../contexts/WalletContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Home/Landing'
import Section from '../../components/Section'
import ConnectWallet from '../../components/ConnectWallet'
import MintPortal from '../../components/Mint/MintPortal'

export default function Page() {
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()
  const { connected, populatedWallet } = useWallet()

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        {!isPreSaleOnline && !isPublicSaleOnline ? (
          <Section>Pre-sale is offline, public sale is offline, you shouldn't be here right now :)</Section>
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
