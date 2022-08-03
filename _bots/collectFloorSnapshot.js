require('dotenv').config()
const axios = require('axios')
const getFoxFloorV2 = require('../functions/markets/getFoxFloorV2')
const { ADMIN_CODE } = require('../constants/api-keys')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const BFMC_API = 'https://badfoxmc.com/api'

const collectFloorSnapshot = async (timestamp) =>
  new Promise(async (resolve, reject) => {
    const attributes = await getFoxFloorV2()

    try {
      console.log('Writing floor prices to DB')
      await axios.post(
        `${BFMC_API}/floor/snapshot/${FOX_POLICY_ID}`,
        { timestamp, attributes },
        { headers: { admin_code: ADMIN_CODE } }
      )
      return resolve(true)
    } catch (error) {
      console.error(error?.message)
      console.error(error?.response?.data)
      return reject(error.message)
    }
  })

module.exports = collectFloorSnapshot
