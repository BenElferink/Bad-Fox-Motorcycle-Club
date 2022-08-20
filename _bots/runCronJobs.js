require('dotenv').config()
const cron = require('node-cron')
const { default: axios } = require('axios')
const { ADMIN_CODE } = require('../constants/api-keys')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const URI = 'https://badfoxmc.com/api/snapshot'

const runCronJob = async () => {
  console.log('running cron job')
  const config = { headers: { admin_code: ADMIN_CODE } }

  try {
    await axios.head(`${URI}/floor-prices/${FOX_POLICY_ID}`, config)
  } catch (error) {
    console.error(error)
  }

  console.log('finished cron job')
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
