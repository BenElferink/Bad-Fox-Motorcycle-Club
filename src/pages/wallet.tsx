import useWallet from '../contexts/WalletContext'
import WalletConnect from '../components/Wallet/WalletConnect'
import Wallet from '../components/Wallet'
import { Fragment } from 'react'

const Page = () => {
  const { connected } = useWallet()

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect allowManual introText='Connect to view your personal portfolio.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not connected.</p>
        </Fragment>
      ) : (
        <Wallet />
      )}
    </div>
  )
}

export default Page
