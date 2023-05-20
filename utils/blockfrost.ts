import { BlockFrostAPI } from '@blockfrost/blockfrost-js'

const blockfrost = new BlockFrostAPI({
  projectId: process.env.BLOCKFROST_API_KEY as string,
  network: 'mainnet',
})

export default blockfrost
