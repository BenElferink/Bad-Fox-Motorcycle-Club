import { Fragment } from 'react'
import useWallet from '../contexts/WalletContext'
import WalletConnect from '../components/Wallet/WalletConnect'
import TradeDashboard from '../components/dashboards/TradeDashboard'

const Page = () => {
  const { connected } = useWallet()

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect introText='Connect to trade your NFTs.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not connected.</p>
        </Fragment>
      ) : (
        <TradeDashboard />
      )}
    </div>
  )
}

export default Page
