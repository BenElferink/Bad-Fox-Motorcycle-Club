import axios from 'axios'
import { BLOCKFROST_API_KEY, BLOCKFROST_API_URI } from '../../constants/blockfrost'

const getStakeKeyFromWalletAddress = (walletAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`${BLOCKFROST_API_URI}/addresses/${walletAddress}`, {
        headers: {
          project_id: BLOCKFROST_API_KEY,
        },
      })

      return resolve(res.data.stake_address)
    } catch (error) {
      return reject(error)
    }
  })
}

export default getStakeKeyFromWalletAddress
