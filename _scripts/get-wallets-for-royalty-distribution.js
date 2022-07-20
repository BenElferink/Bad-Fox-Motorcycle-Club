require('dotenv').config()
const fs = require('fs')
const blockfrostJsonFile = require('../data/blockfrost')
const getWalletAddressOfAsset = require('../functions/blockfrost/getWalletAddressOfAsset')

const ROYALTY_SHARE = 56000

const EXCLUDE_ADDRESSES = [
  'addr1qy4nxzwlrszx2f9mnyl6wsn40qkjvtvq5jv98c75sfc28f6v0ekuq5fz4p0ffw5fk0vdm7762xt2cjmafe0upfhnuf5s3ymguq', // $badfoxmc
  'addr1zxj47sy4qxlktqzmkrw8dahe46gtv8seakrshsqz26qnvzypw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspksr3q9nx', // jpg.store
  'addr1w89s3lfv7gkugker5llecq6x3k2vjvfnvp4692laeqe6w6s93vj3j', // cnft.io
  'addr1wyd3phmr5lhv3zssawqjdpnqrm5r5kgppmmf7864p3dvdrqwuutk4', // epoch.art
]

const run = async () => {
  const assets = blockfrostJsonFile?.assets ?? []
  const addresses = {}
  let totalFoxCount = 0

  try {
    for (let idx = 0; idx < assets.length; idx++) {
      const {
        asset,
        onchain_metadata: { attributes },
      } = assets[idx]

      console.log('\nProcessing index:', idx)
      console.log('Asset:', asset)

      const { address } = await getWalletAddressOfAsset(asset)

      if (EXCLUDE_ADDRESSES.includes(address)) {
        console.log('This wallet address is excluded!')
      } else {
        const isCrypto = attributes.Mouth === '(F) Crypto'
        const isCashBag = attributes.Mouth === '(M) Cash Bag'

        if (addresses[address]) {
          addresses[address].foxCount += 1
          addresses[address].cryptoCount += isCrypto ? 1 : 0
          addresses[address].cashBagCount += isCashBag ? 1 : 0
        } else {
          addresses[address] = {
            foxCount: 1,
            cryptoCount: isCrypto ? 1 : 0,
            cashBagCount: isCashBag ? 1 : 0,
          }
        }

        totalFoxCount++
        console.log('Wallet:', address, addresses[address])
      }
    }

    const adaPerFox = ROYALTY_SHARE / totalFoxCount

    const wallets = Object.entries(addresses).map(([addr, obj]) => {
      const adaForFoxes = obj.foxCount * adaPerFox
      const adaForTraits = obj.cryptoCount * 10 + obj.cashBagCount * 10

      return {
        address: addr,
        counts: obj,
        payout: {
          adaForFoxes,
          adaForTraits,
          total: adaForFoxes + adaForTraits,
        },
      }
    })

    fs.writeFileSync(
      './data/royalties.json',
      JSON.stringify({
        _wen: Date.now(),
        totalFoxCount,
        wallets,
      }),
      'utf8'
    )

    console.log('\nDone!')
  } catch (error) {
    console.error(error)
  }
}

run()
