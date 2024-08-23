import { useState } from 'react'
import WalletHero from './WalletHero'
import CollectionSelector from './CollectionSelector'
import CollectionAssets from '../dashboards/CollectionAssets'
import type { PolicyId } from '../../@types'

const Wallet = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<PolicyId | ''>('')

  return (
    <div className='w-full'>
      <div className='px-4'>
        <div className='relative'>
          <WalletHero />
        </div>

        <div className='my-4 flex flex-wrap items-center justify-center'>
          <CollectionSelector
            withWallet
            onSelected={(_policyId) => {
              if (_policyId !== selectedPolicyId) {
                setSelectedPolicyId(_policyId)
              }
            }}
          />
        </div>
      </div>

      {selectedPolicyId ? (
        <div>
          <div className='w-1/2 h-1 mx-auto bg-gray-700 rounded-lg' />
          <div className='my-4'>
            <CollectionAssets policyId={selectedPolicyId} withWallet />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Wallet
