import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import ManageWallets from '../../../components/Wallet/ManageWallets'

export default function Page() {
  const { loading, account, getAccount } = useAuth()

  useEffect(() => {
    if (!account) {
      ;(async () => {
        await getAccount()
      })()
    }
  }, [account])

  return (
    <div className='App flex-col'>
      <Header />
      {loading ? <DiscordFetchingAccount /> : account ? <ManageWallets /> : <DiscordNotAuthorized />}
      <Footer />
    </div>
  )
}
