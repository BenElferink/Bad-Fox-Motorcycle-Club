import blockfrost from '../../utils/blockfrost'

const getWalletAddressOfAsset = (assetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await blockfrost.assetsAddresses(assetId)

      return resolve(data[0])
    } catch (error) {
      return reject(error)
    }
  })
}

export default getWalletAddressOfAsset
