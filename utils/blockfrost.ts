import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import { BLOCKFROST_API_KEY } from '@/constants'

const blockfrost = new BlockFrostAPI({
  projectId: BLOCKFROST_API_KEY,
  network: 'mainnet',
})

export default blockfrost
