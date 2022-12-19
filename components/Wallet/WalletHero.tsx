import React from 'react'
import useWallet from '../../contexts/WalletContext'

const WalletHero = () => {
  const { populatedWallet, connectedName, disconnectWallet } = useWallet()

  return (
    <section className='w-full p-2 bg-gray-900 bg-opacity-50 text-center rounded-xl border border-gray-700'>
      <h3 className='text-xl'>My Wallet ({connectedName})</h3>
      <p className='text-xs my-1 truncate text-gray-200'>{populatedWallet?.stakeKey}</p>

      <button
        type='button'
        onClick={disconnectWallet}
        className='p-1 px-2 mt-2 bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-red-900 hover:border-red-700 text-xs hover:text-gray-200'
      >
        Disconnect
      </button>
    </section>
  )
}

export default WalletHero
