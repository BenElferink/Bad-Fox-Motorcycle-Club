import { Fragment, useState } from 'react'
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
          <div className='w-full h-0.5 my-8 bg-gray-700 rounded-lg' />
          <CollectionAssets policyId={selectedPolicyId} withWallet />
        </div>
      ) : null}
    </div>
  )
}

export default Wallet
