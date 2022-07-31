require('dotenv').config()
const axios = require('axios')
const getFoxFloor = require('../functions/markets/getFoxFloor')
const { ADMIN_CODE } = require('../constants/api-keys')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const BFMC_API = 'https://badfoxmc.com/api'

const getFloor = async (timestamp) =>
  new Promise(async (resolve, reject) => {
    const floorData = await getFoxFloor()

    const writeToDb = (obj) =>
      new Promise(async (resolve, reject) => {
        const payload = {
          type: obj.type,
          price: obj.price,
          timestamp,
        }

        try {
          console.log(`Making request for type ${obj.type}`)
          await axios.post(`${BFMC_API}/floor/${FOX_POLICY_ID}`, payload, { headers: { admin_code: ADMIN_CODE } })
          return resolve(true)
        } catch (error) {
          console.error(error?.message)
          console.error(error?.response?.data)
          return reject(error.message)
        }
      })

    console.log('Writing floor prices to DB')
    await Promise.all(floorData.map(writeToDb))
    resolve(true)
  })

module.exports = getFloor
