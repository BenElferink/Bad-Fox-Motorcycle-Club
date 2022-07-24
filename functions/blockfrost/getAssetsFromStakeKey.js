const blockfrost = require('../../utils/blockfrost')

const getAssetsFromStakeKey = (stakeKey, policyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assets = (await blockfrost.accountsAddressesAssetsAll(stakeKey)).map(({ unit }) => unit)

      return resolve(policyId ? assets.filter((str) => str.indexOf(policyId) === 0) : assets)
    } catch (e) {
      return reject(e)
    }
  })
}

module.exports = getAssetsFromStakeKey
