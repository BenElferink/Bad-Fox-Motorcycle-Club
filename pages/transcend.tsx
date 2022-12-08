import useWallet from '../contexts/WalletContext'
import ConnectWallet from '../components/ConnectWallet'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Transcendence from '../components/Dashboards/Transcendence'

const Page = () => {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <div className='App flex-col'>
        <Header />
        <ConnectWallet introText='Connect a wallet to transcend your NFTs.' />
        <Footer />
      </div>
    )
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Transcendence />
      <Footer />
    </div>
  )
}

export default Page
