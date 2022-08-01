require('dotenv').config()
const fs = require('fs')
const { exec } = require('child_process')
const assetsFile = require('../data/assets/fox')
const getWalletAddressOfAsset = require('../functions/blockfrost/getWalletAddressOfAsset')
const getStakeKeyFromWalletAddress = require('../functions/blockfrost/getStakeKeyFromWalletAddress')
const { BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET } = require('../constants/addresses')

const VOLUME = 1000000
const ROYALTY_FEE = 0.07
const ROYALTY_TO_GIVE = 0.8
const ROYALTY_SHARE = VOLUME * ROYALTY_FEE * ROYALTY_TO_GIVE

const EXCLUDE_ADDRESSES = [BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET]

const getHolders = (timestamp) =>
  new Promise((resolve, reject) => {
    // manage git pull
    exec('git fetch && git pull --no-rebase', async (gitPullError, gitPullStdout, gitPullStderr) => {
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

          const address = await getWalletAddressOfAsset(asset)

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

        const wallets = Object.entries(stakeAddresses)
          .map(([sKey, obj]) => {
            const foxCount = obj.foxCount
            const adaForFoxes = foxCount * adaPerFox

            const bonusTraitsCount = obj.cryptoCount + obj.cashBagCount
            const adaForBonusTraits = bonusTraitsCount * 10

            const totalAda = adaForFoxes + adaForBonusTraits
            const totalLovelace = totalAda * 1000000

            return {
              stakeKey: sKey,
              addresses: obj.addresses,
              count: {
                foxCount,
                bonusTraitsCount,
              },
              payout: {
                adaForFoxes,
                adaForBonusTraits,
                totalAda,
                totalLovelace,
              },
            }
          })
          .sort((a, b) => b.count.foxCount - a.count.foxCount)

        fs.writeFileSync(
          './data/snapshots/holders.json',
          JSON.stringify({
            _wen: timestamp,
            totalFoxCount,
            totalAdaPayout: wallets.reduce((prev, curr) => prev + curr.payout.totalAda, 0),
            wallets,
          }),
          'utf8'
        )

        console.log('\nDone!')
      } catch (error) {
        console.error(error)
      }

      // manage git push
      exec(
        'git add ./data/snapshots/holders.json && git commit -m "🤖 BOT: updated holders snapshot" && git push',
        (gitPushError, gitPushStdout, gitPushStderr) => {
          resolve(true)
        }
      )
    })
  })

module.exports = getHolders
