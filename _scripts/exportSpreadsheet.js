require('dotenv').config()
const axios = require('axios')
const writeXlsxFile = require('write-excel-file/node')
const { ADMIN_CODE } = require('../constants/api-keys')

const URL = 'http://localhost:3000' // 'https://badfoxmc.com'
const HEADER_ROW = [{ value: 'Name' }, { value: 'Address' }, { value: 'Count Allowed To Mint' }]
const COLUMN_SIZE = [{ width: 30 }, { width: 100 }, { width: 10 }]

const run = async () => {
  const ogs = [HEADER_ROW]

  try {
    const { data } = await axios.get(`${URL}/api/registered-members?adminCode=${ADMIN_CODE}`)

    for (const { username, roles, wallet } of data.members) {
      if (!wallet.address) {
        console.error(username, '- did not submit address')
      } else {
        const address = wallet.address
        const name = username
        const isOG = roles.isOG

        const payload = [
          { type: String, value: name },
          { type: String, value: address },
          { type: Number, value: isOG ? 3 : 2 },
        ]

        if (isOG) {
          ogs.push(payload)
        } else {
          console.error(username, '- not an OG')
        }
      }
    }
  } catch (error) {
    console.error(error)
  }

  console.log('OGs:', ogs.length - 1)
  await writeXlsxFile(ogs, {
    columns: COLUMN_SIZE,
    filePath: './_scripts/badfox-og.xlsx',
  })

  console.log('done!')
}

run()
