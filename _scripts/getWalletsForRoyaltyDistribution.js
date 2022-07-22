require('dotenv').config()
const fs = require('fs')
const assetsFile = require('../data/assets/fox')
const getWalletAddressOfAsset = require('../functions/blockfrost/getWalletAddressOfAsset')
const getStakeKeyFromWalletAddress = require('../functions/blockfrost/getStakeKeyFromWalletAddress')

const ROYALTY_SHARE = 56000

const EXCLUDE_ADDRESSES = [
  'addr1qy4nxzwlrszx2f9mnyl6wsn40qkjvtvq5jv98c75sfc28f6v0ekuq5fz4p0ffw5fk0vdm7762xt2cjmafe0upfhnuf5s3ymguq', // $badfoxmc
  'addr1zxj47sy4qxlktqzmkrw8dahe46gtv8seakrshsqz26qnvzypw288a4x0xf8pxgcntelxmyclq83s0ykeehchz2wtspksr3q9nx', // jpg.store
  'addr1w89s3lfv7gkugker5llecq6x3k2vjvfnvp4692laeqe6w6s93vj3j', // cnft.io
  'addr1wyd3phmr5lhv3zssawqjdpnqrm5r5kgppmmf7864p3dvdrqwuutk4', // epoch.art
]

const run = async () => {
  const assets = assetsFile.assets
  const stakeAddresses = {}
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

        let stakeKey = ''
        const existingStakeKeyArr = Object.entries(stakeAddresses).filter(([sKey, obj]) =>
          obj.addresses.includes(address)
        )

        if (existingStakeKeyArr.length) {
          stakeKey = existingStakeKeyArr[0][0]
        } else {
          stakeKey = await getStakeKeyFromWalletAddress(address)
        }

        if (stakeAddresses[stakeKey]) {
          const addressAlreadyExists = stakeAddresses[stakeKey].addresses.find((str) => str === address)

          if (!addressAlreadyExists) {
            stakeAddresses[stakeKey].addresses.push(address)
          }

          stakeAddresses[stakeKey].foxCount += 1
          stakeAddresses[stakeKey].cryptoCount += isCrypto ? 1 : 0
          stakeAddresses[stakeKey].cashBagCount += isCashBag ? 1 : 0
        } else {
          stakeAddresses[stakeKey] = {
            addresses: [address],
            foxCount: 1,
            cryptoCount: isCrypto ? 1 : 0,
            cashBagCount: isCashBag ? 1 : 0,
          }
        }

        totalFoxCount++
        console.log('Stake key:', stakeKey, stakeAddresses[stakeKey])
      }
    }

    const adaPerFox = ROYALTY_SHARE / totalFoxCount

    const wallets = Object.entries(stakeAddresses).map(([sKey, obj]) => {
      const adaForFoxes = obj.foxCount * adaPerFox
      const adaForTraits = obj.cryptoCount * 10 + obj.cashBagCount * 10

      return {
        satekKey: sKey,
        address: obj.addresses,
        counts: {
          foxCount: obj.foxCount,
          cryptoCount: obj.cryptoCount,
          cashBagCount: obj.cashBagCount,
        },
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
