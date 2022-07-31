import { useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Landing from '../../../components/Landing'
import DiscordFetchingAccount from '../../../components/DiscordAuth/FetchingAccount'
import DiscordNotAuthorized from '../../../components/DiscordAuth/NotAuthorized'
import CheckWallet from '../../../components/Mint/CheckWallet'

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
      <Landing>
        {loading ? <DiscordFetchingAccount /> : account ? <CheckWallet /> : <DiscordNotAuthorized />}
      </Landing>
      <Footer />
    </div>
  )
}
