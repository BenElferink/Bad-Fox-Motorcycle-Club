import { useState } from 'react'
import WalletHero from './WalletHero'
import CollectionCharts from './CollectionCharts'
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

          {selectedPolicyId ? <CollectionCharts policyId={selectedPolicyId} /> : null}
        </div>
      </div>

      <div>{selectedPolicyId ? <CollectionAssets policyId={selectedPolicyId} withWallet /> : null}</div>
    </div>
  )
}

export default Wallet
