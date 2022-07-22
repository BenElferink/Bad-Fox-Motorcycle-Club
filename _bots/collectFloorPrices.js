require('dotenv').config()
const cron = require('node-cron')
const axios = require('axios')
const getFoxFloor = require('../functions/markets/getFoxFloor')
const { ADMIN_CODE } = require('../constants/api-keys')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const getFox = async (timestamp) =>
  new Promise(async (resolve, reject) => {
    const floorData = await getFoxFloor()

    const writeToDb = (obj) =>
      new Promise(async (resolve, reject) => {
        try {
          console.log(`Making request for type ${obj.type}`)
          await axios.post(`http://localhost:3000/api/floor/${FOX_POLICY_ID}?adminCode=${ADMIN_CODE}`, obj)
          return resolve(true)
        } catch (error) {
          console.error(error.response.data)
          return writeToDb(obj)
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

// runCronJob()

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
