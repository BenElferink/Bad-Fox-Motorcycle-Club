import { Fragment } from 'react'
import useWallet from '../../contexts/WalletContext'
import WalletConnect from '../../components/Wallet/WalletConnect'
import AdminDashboard from '../../components/dashboards/AdminDashboard'

const ADMIN_STAKE_KEYS = [
  'stake1ux65w9j86elkh0nfmhrnvyx6qek77sppw2qpzxfur4l5xcqvvc06y', // club typhoon
  'stake1u9x8umwq2y32sh55h2ym8kxal0d9r94vfd75uh7q5me7y6g4nc2q3', // club nami
  'stake1uyrw60enksgl48f2zld99g9q8qzrnepjgntjnqz9twlvqygjv8kj9', // ben nami
]

const Page = () => {
  const { connected, populatedWallet } = useWallet()

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect introText='Connect with an ADMIN wallet to pay royalties.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not connected.</p>
        </Fragment>
      ) : !ADMIN_STAKE_KEYS.includes(populatedWallet.stakeKey) ? (
        <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not an admin.</p>
      ) : (
        <AdminDashboard />
      )}
    </div>
  )
}

export default Page
