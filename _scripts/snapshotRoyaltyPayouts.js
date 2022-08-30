require('dotenv').config()
const fs = require('fs')
const { blockfrost } = require('../utils/blockfrost')
const foxAssetsFile = require('../data/assets/fox')
const POLICY_IDS = require('../constants/policy-ids')
const { EXCLUDE_ADDRESSES } = require('../constants/addresses')

const VOLUME = 500000 // 1000000
const ROYALTY_FEE = 0.07
const ROYALTY_TO_GIVE = 0.8
const ROYALTY_SHARE = VOLUME * ROYALTY_FEE * ROYALTY_TO_GIVE

const run = async () => {
  let unlistedAssetsCount = 0

  const policyId = POLICY_IDS.FOX_POLICY_ID
  const assets = foxAssetsFile.assets
  const holders = []

  // associate all asset IDs to their wallets (collect stake key and wallet addresses)

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

  // count the payouts for every holder (only for royalties)

  let totalAdaPayout = 0
  const adaPerAsset = ROYALTY_SHARE / unlistedAssetsCount

  const wallets = holders
    .map((wallet) => {
      const assetCount = wallet.assets.length
      const adaForAssets = Math.floor(assetCount * adaPerAsset)

      let traitCount = 0
      let traitPayout = 0

      if (policyId === POLICY_IDS.FOX_POLICY_ID) {
        traitPayout = 10

        for (const assetId of wallet.assets) {
          const {
            onchain_metadata: {
              attributes: { Mouth },
            },
          } = assets.find((asset) => asset.assetId === assetId)

          if (Mouth === '(F) Crypto' || Mouth === '(F) Cash Bag') {
            traitCount++
          }
        }
      }

      const adaForTraits = Math.floor(traitCount * traitPayout)

      const totalAda = adaForAssets + adaForTraits
      const totalLovelace = totalAda * 1000000

      totalAdaPayout += totalAda

      return {
        ...wallet,
        payout: {
          adaForAssets,
          adaForTraits,
          totalAda,
          totalLovelace,
        },
      }
    })
    .sort((a, b) => b.assets.length - a.assets.length)

  const payload = {
    policyId,
    timestamp: Date.now(),
    totalAssetCount,
    totalAdaPayout,
    wallets,
  }

  fs.writeFileSync('./_temp/badfox-royalty-payouts.json', JSON.stringify(payload), 'utf8')

  console.log('\nDone!')
}

run()
