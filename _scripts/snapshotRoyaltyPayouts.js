require('dotenv').config()
const fs = require('fs')
const writeXlsxFile = require('write-excel-file/node')
const { blockfrost } = require('../utils/blockfrost')
const foxAssetsFile = require('../data/assets/fox.json')
const POLICY_IDS = require('../constants/policy-ids')
const { EXCLUDE_ADDRESSES } = require('../constants/addresses')

const ADA_IN_POOL = 30000
const PERCENT_TO_GIVE = 0.8
const HOLDERS_SHARE = ADA_IN_POOL * PERCENT_TO_GIVE

const run = async () => {
  let unlistedAssetsCount = 0

  const policyId = POLICY_IDS.BAD_FOX_POLICY_ID
  const assets = foxAssetsFile.assets
  const holders = []

  for (const { assetId } of assets) {
    console.log('\nProcessing asset:', assetId)

    const walletAddress = await blockfrost.getWalletAddressWithAssetId(assetId)

    if (EXCLUDE_ADDRESSES.includes(walletAddress)) {
      console.log('This wallet is excluded!')
    } else {
      const holderWithIncludedWalletAddress = holders.find((item) => item.addresses.includes(walletAddress))

      const stakeKey =
        holderWithIncludedWalletAddress?.stakeKey || (await blockfrost.getStakeKeyWithWalletAddress(walletAddress))

      const holderIndex = holders.findIndex((item) => item.stakeKey === stakeKey)

      if (holderIndex === -1) {
        holders.push({
          stakeKey,
          addresses: [walletAddress],
          assets: [assetId],
        })
      } else {
        if (!holderWithIncludedWalletAddress) {
          holders[holderIndex].addresses.push(walletAddress)
        }

        holders[holderIndex].assets.push(assetId)
      }

      unlistedAssetsCount++
    }
  }

  let totalPayoutsCount = 0
  const adaPerAsset = HOLDERS_SHARE / unlistedAssetsCount

  const wallets = holders
    .map((wallet) => {
      const assetCount = wallet.assets.length
      const adaForAssets = Math.floor(assetCount * adaPerAsset)
      let adaForTraits = 0

      if (policyId === POLICY_IDS.BAD_FOX_POLICY_ID) {
        traitPayout = 10

        for (const assetId of wallet.assets) {
          const {
            attributes: { Mouth },
          } = assets.find((asset) => asset.assetId === assetId)

          if (Mouth === '(F) Crypto') {
            adaForTraits += 10
          } else if (Mouth === '(M) Cash Bag') {
            adaForTraits += 10
          } else if (Mouth === '(M) Clover') {
            adaForTraits += 50
          }
        }
      }

      const totalAda = adaForAssets + adaForTraits
      totalPayoutsCount += totalAda

      return {
        payout: {
          adaForAssets,
          adaForTraits,
          totalAda,
          totalLovelace: totalAda * 1000000,
        },
        ...wallet,
      }
    })
    .sort((a, b) => b.payout.totalAda - a.payout.totalAda)

  const payload = {
    policyId,
    timestamp: Date.now(),
    totalAssets: unlistedAssetsCount,
    totalPayouts: totalPayoutsCount,
    wallets,
  }

  fs.writeFileSync('./_temp/royalty-snapshot.json', JSON.stringify(payload), 'utf8')

  const COLUMN_SIZE = [{ width: 60 }, { width: 100 }, { width: 25 }]
  const HEADER_ROW = [{ value: 'Stake Key' }, { value: 'Wallet Address' }, { value: 'Total ADA' }]

  const excelRows = [HEADER_ROW]

  wallets.forEach(({ stakeKey, addresses, payout }) => {
    excelRows.push([
      { type: String, value: stakeKey },
      { type: String, value: addresses[0] },
      { type: String, value: String(payout.totalAda) },
    ])
  })

  await writeXlsxFile(excelRows, {
    columns: COLUMN_SIZE,
    filePath: './_temp/royalty-snapshot.xlsx',
  })

  console.log('Done!')
}

run()
