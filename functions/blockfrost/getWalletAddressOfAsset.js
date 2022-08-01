const blockfrost = require('../../utils/blockfrost')

const getWalletAddressOfAsset = (assetId) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Fetching wallet address of asset ID: ${assetId}`)

    try {
      const [{ address }] = await blockfrost.assetsAddresses(assetId)

      console.log(`Wallet address found: ${address}`)
      return resolve(address)
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = getWalletAddressOfAsset
