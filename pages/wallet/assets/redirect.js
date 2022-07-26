import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import MyWalletAssets from '../../../components/Wallet/MyAssets'

export default function Page() {
  const { loading, token, account, getAccount } = useAuth()

  useEffect(() => {
    ;(async () => {
      await getAccount()
    })()
  }, [])

  return (
    <div className='App flex-col'>
      <Header />
      {loading ? <DiscordFetchingAccount /> : account ? <MyWalletAssets /> : <DiscordNotAuthorized />}
      <Footer />
    </div>
  )
}
