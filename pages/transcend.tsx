import { Fragment } from 'react'
import useWallet from '../contexts/WalletContext'
import WalletConnect from '../components/Wallet/WalletConnect'
import BurnDashboard from '../components/dashboards/BurnDashboard'

const Page = () => {
  const { connected } = useWallet()

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect introText='Connect to transcend your NFTs.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not connected.</p>
        </Fragment>
      ) : (
        <BurnDashboard />
      )}
    </div>
  )
}

export default Page
