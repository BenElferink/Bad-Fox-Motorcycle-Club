import { useState } from 'react'
import WalletHero from './WalletHero'
import CollectionCharts from './CollectionCharts'
import CollectionSelector from './CollectionSelector'
import CollectionAssets from '../dashboards/CollectionAssets'
import { PolicyId } from '../../@types'

const Wallet = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<PolicyId | ''>('')

  return (
    <div className='w-full'>
      <div className='px-4'>
        <WalletHero />

        <div className='my-4 flex flex-wrap items-center justify-center'>
          <CollectionSelector
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
