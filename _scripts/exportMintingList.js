require('dotenv').config()
const axios = require('axios')
const writeXlsxFile = require('write-excel-file/node')
const holdersSnapshot = require('../data/snapshots/holders')
const { ADMIN_CODE } = require('../constants/api-keys')

const URL = 'http://localhost:3000' // 'https://badfoxmc.com'

const COLUMN_SIZE = [{ width: 25 }, { width: 25 }, { width: 100 }, { width: 60 }]
const HEADER_ROW = [
  { value: 'Name' },
  { value: 'Count Allowed to Mint' },
  { value: 'Wallet Address' },
  { value: 'Stake Key' },
]

const run = async () => {
  const wallets = [HEADER_ROW]
  let mints = 0

  holdersSnapshot.wallets.forEach(({ stakeKey, addresses, counts: { foxCount } }, idx) => {
    console.log(`holders snapshot - processing index ${idx} of ${holdersSnapshot.wallets.length - 1}`)

    const allowedToMint = Math.floor(foxCount / 3)

    if (allowedToMint) {
      wallets.push([
        { type: String, value: 'SNAPSHOT' },
        { type: String, value: String(allowedToMint) },
        { type: String, value: addresses[0] },
        { type: String, value: stakeKey },
      ])

      mints += allowedToMint
    }
  })

  try {
    const {
      data: { accounts },
    } = await axios.get(`${URL}/api/account/all`, { headers: { admin_code: ADMIN_CODE } })

    accounts.forEach(({ username, roles: { isOG }, wallet }, idx) => {
      console.log(`registered account - processing index ${idx} of ${accounts.length - 1}`)

      if (isOG && wallet?.address) {
        const foundIdx = wallets.findIndex((arr) => arr[3].value === wallet.stakeKey)

        if (foundIdx != null) {
          wallets[foundIdx][0].value = username
          wallets[foundIdx][1].value = String(Number(wallets[foundIdx][1].value) + 1)
        } else {
          wallets.push([
            { type: String, value: username },
            { type: String, value: '1' },
            { type: String, value: wallet.address },
            { type: String, value: wallet.stakeKey },
          ])
        }

        mints++
      }
    })
  } catch (error) {
    console.error(error)
  }

  console.log('total wallets:', wallets.length - 1)
  console.log('total mints:', mints)

  await writeXlsxFile(wallets, {
    columns: COLUMN_SIZE,
    filePath: './_scripts/minting-list.xlsx',
  })

  console.log('done!')
}

run()
