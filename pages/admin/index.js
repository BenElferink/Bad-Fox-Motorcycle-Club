import useWallet from '../../contexts/WalletContext'
import ConnectWallet from '../../components/ConnectWallet'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminDashboard from '../../components/AdminDashboard'

const ADMIN_STAKE_KEYS = [
  'stake1u9psthdpkfklakeshj0dhxw7r2k98q32p7gzzrudgaw308c83u94y', // royalty wallet
  'stake1uyrw60enksgl48f2zld99g9q8qzrnepjgntjnqz9twlvqygjv8kj9', // ben nami
]

export default function Page() {
  const { connected, populatedWallet } = useWallet()

  if (!connected) {
    return (
      <div className='App flex-col'>
        <Header />
        <ConnectWallet modalOnly />
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
