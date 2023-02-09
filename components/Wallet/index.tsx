import { useEffect, useState } from 'react'
import WalletHero from './WalletHero'
import CollectionCharts from './CollectionCharts'
import CollectionSelector from './CollectionSelector'
import CollectionAssets from '../dashboards/CollectionAssets'
import { PolicyId } from '../../@types'
import useWallet from '../../contexts/WalletContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Wallet = () => {
  const { connectedManually, populatedWallet } = useWallet()
  const [spaceTroopersActive, setSpaceTroopersActive] = useState(false)
  const [selectedPolicyId, setSelectedPolicyId] = useState<PolicyId | ''>('')

  const getSpaceTroopersStatus = async (stakeKey: string) => {
    try {
      const { data } = await axios.get(`/api/wallet/${stakeKey}/space-troopers`)
      setSpaceTroopersActive(data.active)
    } catch (error) {
      console.error(error)
    }
  }

  const updateSpaceTroopersStatus = async (active: boolean) => {
    try {
      toast.loading('Processing...')

      const stakeKey = populatedWallet?.stakeKey || ''
      const walletAddress = populatedWallet?.walletAddress

      await axios.put(`/api/wallet/${stakeKey}/space-troopers`, {
        stakeKey,
        walletAddress,
        active,
      })

      setSpaceTroopersActive(active)

      toast.dismiss()
      toast.success('Done!')
    } catch (error: any) {
      console.error(error)

      toast.dismiss()
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!connectedManually) {
      getSpaceTroopersStatus(populatedWallet?.stakeKey || '')
    }
  }, [connectedManually, populatedWallet])

  return (
    <div className='w-full'>
      <div className='px-4'>
        <div className='relative'>
          <WalletHero />

          {connectedManually ? null : (
            <div className='absolute bottom-2 right-0'>
              <label className='mr-4 flex items-center hover:text-white cursor-pointer'>
                <input
                  type='checkbox'
                  checked={spaceTroopersActive}
                  onChange={(e) => updateSpaceTroopersStatus(e.target.checked)}
                />
                <span className='ml-1 text-xs'>SpaceTroopers Arena: auto-enter, daily (BETA)</span>
              </label>
            </div>
          )}
        </div>

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
