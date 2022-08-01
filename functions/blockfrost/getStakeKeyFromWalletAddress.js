const blockfrost = require('../../utils/blockfrost')

const getStakeKeyFromWalletAddress = (walletAddress) => {
  return new Promise(async (resolve, reject) => {
    console.log(`Fetching stake key of wallet address: ${walletAddress}`)

    try {
      const { stake_address } = await blockfrost.addresses(walletAddress)

      console.log(`Stake key found: ${stake_address}`)
      return resolve(stake_address)
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = getStakeKeyFromWalletAddress
