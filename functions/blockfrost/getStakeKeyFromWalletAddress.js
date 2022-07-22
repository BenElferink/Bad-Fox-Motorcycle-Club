const blockfrost = require('../../utils/blockfrost')

const getStakeKeyFromWalletAddress = (walletAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await blockfrost.addresses(walletAddress)

      return resolve(data.stake_address)
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = getStakeKeyFromWalletAddress
