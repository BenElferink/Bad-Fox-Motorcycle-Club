const { BlockFrostAPI } = require('@blockfrost/blockfrost-js')
const { BLOCKFROST_API_KEY } = require('../constants/api-keys')

const blockfrost = new BlockFrostAPI({
  projectId: BLOCKFROST_API_KEY,
  version: 0,
  debug: false,
  isTestnet: false,
  rateLimiter: true,
  requestTimeout: 20000,
})

module.exports = blockfrost
