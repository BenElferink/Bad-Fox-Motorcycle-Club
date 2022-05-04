import axios from 'axios'
import { BLOCKFROST_API_KEY, BLOCKFROST_API_URI } from '../../constants/blockfrost'

const getAssetsFromStakeKey = (stakeKey) => {
  return new Promise(async (resolve, reject) => {
    let assets = []
    let error = undefined

    for (let page = 1; true; page++) {
      try {
        const { data } = await axios.get(`${BLOCKFROST_API_URI}/accounts/${stakeKey}/addresses/assets?page=${page}`, {
          headers: {
            project_id: BLOCKFROST_API_KEY,
          },
        })

        if (!data.length) {
          break
        }

        assets = assets.concat(data)
      } catch (e) {
        return reject(error)
      }
    }

    return resolve(assets.filter(({ unit }) => unit.indexOf('TODO: Policy ID') === 0).map(({ unit }) => unit))
  })
}

export default getAssetsFromStakeKey
