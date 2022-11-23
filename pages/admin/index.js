import useWallet from '../../contexts/WalletContext'
import ConnectWallet from '../../components/ConnectWallet'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminDashboard from '../../components/AdminDashboard'

const ADMIN_STAKE_KEYS = [
  'stake1u9psthdpkfklakeshj0dhxw7r2k98q32p7gzzrudgaw308c83u94y', // club royalty wallet
  'stake1u9x8umwq2y32sh55h2ym8kxal0d9r94vfd75uh7q5me7y6g4nc2q3', // club nami wallet old
]

export default function Page() {
  const { connected, populatedWallet } = useWallet()

  if (!connected) {
    return (
      <div className='App flex-col'>
        <Header />
        <ConnectWallet disableManual introText='Connect a wallet to view view the admin dashabord' />
        <Footer />
      </div>
    )
  }

  if (!ADMIN_STAKE_KEYS.includes(populatedWallet.stakeKey)) {
    return (
      <div className='App flex-col'>
        <Header />
        <div>not an admin</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className='App flex-col'>
      <Header />
      <AdminDashboard />
      <Footer />
    </div>
  )
}
