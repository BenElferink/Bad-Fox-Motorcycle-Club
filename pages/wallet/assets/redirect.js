import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import MyWalletAssets from '../../../components/Wallet/MyAssets'

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

      {loading ? (
        <Landing>
          <DiscordFetchingAccount />
        </Landing>
      ) : account ? (
        <MyWalletAssets />
      ) : (
        <Landing>
          <DiscordNotAuthorized />
        </Landing>
      )}
      <Footer />
    </div>
  )
}
