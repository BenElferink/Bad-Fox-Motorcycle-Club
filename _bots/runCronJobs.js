const cron = require('node-cron')
const snapshotFloor = require('./collectFloorSnapshot')
const snapshotHolders = require('./collectHoldersSnapshot')

const runCronJob = async () => {
  console.log('Running cron job')

  const newDate = new Date()
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  const timestamp = newDate.getTime()

  try {
    await snapshotFloor(timestamp)
  } catch (error) {
    console.error(error)
  }

  try {
    await snapshotHolders(timestamp)
  } catch (error) {
    console.error(error)
  }

  console.log('Cron job finished')
}

cron.schedule('0 0 * * *', runCronJob, {
  scheduled: true,
  timezone: 'Asia/Jerusalem',
})
