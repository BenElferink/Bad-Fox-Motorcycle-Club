import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import MyWalletAssets from '../../../components/Wallet/MyAssets'

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
        <MyWalletAssets />
      ) : (
        <DiscordNotAuthorized />
      )}
      <Footer />
    </div>
  )
}
