import axios from 'axios'
import { BLOCKFROST_API_KEY, BLOCKFROST_API_URI } from '../../constants/blockfrost'

const getWalletAddressOfAsset = (assetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`${BLOCKFROST_API_URI}/assets/${assetId}/addresses`, {
        headers: {
          project_id: BLOCKFROST_API_KEY,
        },
      })

      return resolve(res.data[0])
    } catch (error) {
      return reject(error)
    }
  })
}

export default getWalletAddressOfAsset
