import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import ManageWallets from '../../../components/Wallet/ManageWallets'

export default function Page() {
  const { loading, token, account, getAccountWithDiscordToken } = useAuth()

  useEffect(() => {
    ;(async () => {
      await getAccountWithDiscordToken()
    })()
  }, [])

  return (
    <div className='App flex-col'>
      <Header />
      {loading && (!token || !account) ? (
        <DiscordFetchingAccount />
      ) : token && account ? (
        <ManageWallets />
      ) : (
        <DiscordNotAuthorized />
      )}
      <Footer />
    </div>
  )
}
