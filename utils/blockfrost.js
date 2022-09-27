const { BlockFrostAPI } = require('@blockfrost/blockfrost-js')
const { BLOCKFROST_API_KEY } = require('../constants/api-keys')

class Blockfrost {
  constructor() {
    // https://github.com/blockfrost/blockfrost-js
    this.api = new BlockFrostAPI({
      projectId: BLOCKFROST_API_KEY,
      // version: 0,
      // debug: false,
      // isTestnet: false,
      // rateLimiter: true,
      // requestTimeout: 20000,
    })
  }

  getAssetIdsWithPolicyId = (policyId) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching asset IDs with policy ID:', policyId)

        const assetIds = []
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

  getAssetWithAssetId = (assetId) => {
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

  getAssetIdsWithStakeKey = (stakeKey, policyId) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching asset IDs with stake key:', stakeKey)

        const assetIds = []
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

  getWalletAddressWithAssetId = (assetId) => {
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

  getStakeKeyWithWalletAddress = (walletAddress) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching stake key with wallet address:', walletAddress)

        const data = await this.api.addresses(walletAddress)
        const stakeKey = data.stake_address

        console.log('Fetched stake key:', stakeKey)
        return resolve(stakeKey)
      } catch (error) {
        return reject(error)
      }
    })
  }

  getWalletAddressesWithStakeKey = (stakeKey) => {
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

  getWalletWithWalletAddress = (walletAddress) => {
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

module.exports = {
  Blockfrost,
  blockfrost,
}
