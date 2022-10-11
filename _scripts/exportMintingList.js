require('dotenv').config()
const fs = require('fs')
const writeXlsxFile = require('write-excel-file/node')
const { default: axios } = require('axios')
const holdersSnapshot = require('../_temp/badfox-royalty-payouts.json')
const { ADMIN_CODE } = require('../constants/api-keys')

const URL = 'http://localhost:3000' // 'https://badfoxmc.com'

const COLUMN_SIZE = [{ width: 25 }, { width: 100 }, { width: 60 }]
const HEADER_ROW = [{ value: 'Count Allowed to Mint' }, { value: 'Wallet Address' }, { value: 'Stake Key' }]

const run = async () => {
  const wallets = [HEADER_ROW]
  let mints = 0

  holdersSnapshot.wallets.forEach(({ stakeKey, addresses, assets }, idx) => {
    console.log(`holders snapshot - processing index ${idx} of ${holdersSnapshot.wallets.length - 1}`)

    const allowedToMint = Math.floor(assets.length / 3)

    if (allowedToMint) {
      wallets.push([
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
    } = await axios.get(`${URL}/api/discord-accounts`, { headers: { admin_code: ADMIN_CODE } })

    accounts.forEach(({ roles: { isOG }, mintWallet }, idx) => {
      console.log(`registered account - processing index ${idx} of ${accounts.length - 1}`)

      if (isOG && mintWallet?.address) {
        const foundIdx = wallets.findIndex((arr) => arr[2].value === mintWallet.stakeKey)

        if (foundIdx != -1) {
          wallets[foundIdx][0].value = String(Number(wallets[foundIdx][0].value) + 1)
        } else {
          wallets.push([
            { type: String, value: '1' },
            { type: String, value: mintWallet.address },
            { type: String, value: mintWallet.stakeKey },
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

  fs.writeFileSync(
    `./_temp/minting-list.json`,
    JSON.stringify({
      count: wallets.length - 1,
      mints,
      wallets: wallets.map((arr) => ({
        amount: Number(arr[0].value),
        stakeKey: arr[2].value,
      })),
    }),
    'utf8'
  )

  await writeXlsxFile(wallets, {
    columns: COLUMN_SIZE,
    filePath: './_temp/minting-list.xlsx',
  })

  console.log('done!')
}

run()
