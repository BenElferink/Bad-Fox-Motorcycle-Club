require('dotenv').config()
const cron = require('node-cron')
const axios = require('axios')
const getFoxFloor = require('../functions/markets/getFoxFloor')
const { ADMIN_CODE } = require('../constants/api-keys')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const BFMC_API = 'https://badfoxmc.com/api'

const getFox = async (timestamp) =>
  new Promise(async (resolve, reject) => {
    const floorData = await getFoxFloor()

    const writeToDb = (obj) =>
      new Promise(async (resolve, reject) => {
        const payload = {
          type: obj.type,
          price: obj.type,
          timestamp,
        }

        try {
          console.log(`Making request for type ${obj.type}`)
          await axios.post(`${BFMC_API}/floor/${FOX_POLICY_ID}?adminCode=${ADMIN_CODE}`, payload)
          return resolve(true)
        } catch (error) {
          console.error(error)
          console.error(error?.message)
          console.error(error?.response?.data)
          return reject(error.message)
        }
      })

    console.log('Writing floor prices to DB')
    await Promise.all(floorData.map(writeToDb))
    resolve(true)
  })

const runCronJob = async () => {
  console.log('Running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  try {
    await getFox(timestamp)
  } catch (error) {
    console.error(error)
  }

  console.log('Cron job finished')
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
