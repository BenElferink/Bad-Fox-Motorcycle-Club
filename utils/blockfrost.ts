import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import { BLOCKFROST_API_KEY } from '../constants'

class Blockfrost {
  api: BlockFrostAPI

  constructor() {
    this.api = new BlockFrostAPI({
      projectId: BLOCKFROST_API_KEY,
    })
  }

  getAssetIdsWithPolicyId = (policyId: string): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching asset IDs with policy ID:', policyId)

        const assetIds: string[] = []
        const data = await this.api.assetsPolicyByIdAll(policyId)

        data.forEach(({ asset }) => {
          if (asset !== policyId) {
            assetIds.push(asset)
          }
        })

        console.log(`Fetched ${assetIds.length} asset IDs`)

        return resolve(assetIds)
      } catch (e) {
        return reject(e)
      }
    })
  }

  getAssetWithAssetId = (
    assetId: string
  ): Promise<{
    asset: string
    policy_id: string
    asset_name: string | null
    fingerprint: string
    quantity: string
    initial_mint_tx_hash: string
    mint_or_burn_count: number
    onchain_metadata: {
      [key: string]: unknown
    } | null
    onchain_metadata_standard?: ('CIP25v1' | 'CIP25v2') | null
    metadata: {
      name: string
      description: string
      ticker: string | null
      url: string | null
      logo: string | null
      decimals: number | null
    } | null
  }> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching asset with asset ID:', assetId)

        const data = await this.api.assetsById(assetId)

        console.log('Fetched asset:', data)

        return resolve(data)
      } catch (e) {
        return reject(e)
      }
    })
  }

  getAssetIdsWithStakeKey = (stakeKey: string, policyId?: string): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching asset IDs with stake key:', stakeKey)

        const assetIds: string[] = []
        const data = await this.api.accountsAddressesAssetsAll(stakeKey)

        data.forEach(({ unit }) => {
          if (!policyId || unit.indexOf(policyId) === 0) {
            assetIds.push(unit)
          }
        })

        console.log(`Fetched ${assetIds.length} asset IDs`)

        return resolve(assetIds)
      } catch (e) {
        return reject(e)
      }
    })
  }

  getWalletAddressWithAssetId = (assetId: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching wallet address with asset ID:', assetId)

        const data = await this.api.assetsAddresses(assetId)
        const walletAddress = data[0]?.address ?? ''

        console.log('Fetched wallet address:', walletAddress)
        return resolve(walletAddress)
      } catch (error) {
        return reject(error)
      }
    })
  }

  getStakeKeyWithWalletAddress = (walletAddress: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching stake key with wallet address:', walletAddress)

        const data = await this.api.addresses(walletAddress)
        const stakeKey = data.stake_address || ''

        console.log('Fetched stake key:', stakeKey)
        return resolve(stakeKey)
      } catch (error) {
        return reject(error)
      }
    })
  }

  getWalletAddressesWithStakeKey = (stakeKey: string): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching wallet addresses with stakey key:', stakeKey)

        const data = await this.api.accountsAddressesAll(stakeKey)
        const payload = data.map(({ address }) => address)

        console.log(`Fetched ${payload.length} addresses`)
        return resolve(payload)
      } catch (error) {
        return reject(error)
      }
    })
  }

  getWalletWithWalletAddress = (
    walletAddress: string
  ): Promise<{
    address: string
    amount: {
      unit: string
      quantity: string
    }[]
    stake_address: string | null
    type: 'byron' | 'shelley'
    script: boolean
  }> => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching wallet with wallet address:', walletAddress)

        const data = await this.api.addresses(walletAddress)

        console.log('Fetched wallet:', data)
        return resolve(data)
      } catch (error) {
        return reject(error)
      }
    })
  }
}

const blockfrost = new Blockfrost()

export default blockfrost
