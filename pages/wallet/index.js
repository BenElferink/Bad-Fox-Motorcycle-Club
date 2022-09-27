import useWallet from '../../contexts/WalletContext'
import ConnectWallet from '../../components/ConnectWallet'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Wallet from '../../components/Wallet'

export default function Page() {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <div className='App flex-col'>
        <Header />
        <ConnectWallet modalOnly />
        <Footer />
      </div>
    )
  }

  return (
    <div className='App flex-col'>
      <Header />
      <Wallet />
      <Footer />
    </div>
  )
}
