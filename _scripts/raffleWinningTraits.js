require('dotenv').config()
const fs = require('fs')
const writeXlsxFile = require('write-excel-file/node')
const foxAssets = require('../data/assets/fox')
const getWalletAddressOfAsset = require('../functions/blockfrost/getWalletAddressOfAsset')
const getStakeKeyFromWalletAddress = require('../functions/blockfrost/getStakeKeyFromWalletAddress')
const { BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET } = require('../constants/addresses')

const EXCLUDE_ADDRESSES = [BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET]

const RARE_WIN_COUNT = 2
const COMMON_WIN_COUNT = 30

const RARE_TRAITS = [{ Clothes: '(M) Space Suit' }, { Clothes: '(F) Space Suit' }]
const COMMON_TRAITS = [{ Back: '(U) Blue Flag' }, { Back: '(U) White Flag' }]

const run = async () => {
  const stakeAddresses = {}
  const assets = foxAssets.assets

  const foundAssetsWithRareTraits = []
  const foundAssetsWithCommonTraits = []

  const usedRareIndexes = []
  const usedCommonIndexes = []

  let totalRareCount = 0
  let totalCommonCount = 0

  assets.forEach((item) => {
    RARE_TRAITS.forEach((rareItem) => {
      Object.entries(rareItem).forEach(([key, val]) => {
        if (item.onchain_metadata.attributes[key] === val) {
          foundAssetsWithRareTraits.push(item)
        }
      })
    })

    COMMON_TRAITS.forEach((commonItem) => {
      Object.entries(commonItem).forEach(([key, val]) => {
        if (item.onchain_metadata.attributes[key] === val) {
          foundAssetsWithCommonTraits.push(item)
        }
      })
    })
  })

  console.log('Found assets with common traits:', foundAssetsWithCommonTraits.length)
  console.log('Found assets with rare traits:', foundAssetsWithRareTraits.length)

  const getIndex = (max, usedIndexes) => {
    const idx = Math.floor(Math.random() * max)
    const alreadyUsedIndex = usedIndexes.find((num) => num === idx) != null

    return [idx, alreadyUsedIndex]
  }

  const getKeysForAssetId = async (assetId) => {
    const address = await getWalletAddressOfAsset(assetId)

    if (!EXCLUDE_ADDRESSES.includes(address)) {
      const existingStakeKeyArr = Object.entries(stakeAddresses).filter(([sKey, obj]) =>
        obj.addresses.includes(address)
      )

      if (existingStakeKeyArr.length) {
        return [address, existingStakeKeyArr[0][0]]
      } else {
        return [address, await getStakeKeyFromWalletAddress(address)]
      }
    } else {
      return [address, null]
    }
  }

  const raffleRareTraits = async () => {
    if (totalRareCount === RARE_WIN_COUNT) {
      return
    }

    const [idx, alreadyUsedIndex] = getIndex(foundAssetsWithRareTraits.length, usedRareIndexes)

    if (!alreadyUsedIndex) {
      usedRareIndexes.push(idx)
      const [address, stakeKey] = await getKeysForAssetId(foundAssetsWithRareTraits[idx].asset)

      if (stakeKey) {
        if (stakeAddresses[stakeKey]) {
          const addressAlreadyExists = stakeAddresses[stakeKey].addresses.find((str) => str === address)
          if (!addressAlreadyExists) {
            stakeAddresses[stakeKey].addresses.push(address)
          }

          stakeAddresses[stakeKey].rareCount += 1
          stakeAddresses[stakeKey].rareIds.push(foundAssetsWithRareTraits[idx].onchain_metadata.name)
        } else {
          stakeAddresses[stakeKey] = {
            addresses: [address],
            commonCount: 0,
            commonIds: [],
            rareCount: 1,
            rareIds: [foundAssetsWithRareTraits[idx].onchain_metadata.name],
          }
        }

        totalRareCount++
      }
    }

    return await raffleRareTraits()
  }

  const raffleCommonTraits = async () => {
    if (totalCommonCount === COMMON_WIN_COUNT) {
      return
    }

    const [idx, alreadyUsedIndex] = getIndex(foundAssetsWithCommonTraits.length, usedCommonIndexes)

    if (!alreadyUsedIndex) {
      usedCommonIndexes.push(idx)
      const [address, stakeKey] = await getKeysForAssetId(foundAssetsWithCommonTraits[idx].asset)

      if (stakeKey) {
        if (stakeAddresses[stakeKey]) {
          const addressAlreadyExists = stakeAddresses[stakeKey].addresses.find((str) => str === address)
          if (!addressAlreadyExists) {
            stakeAddresses[stakeKey].addresses.push(address)
          }

          stakeAddresses[stakeKey].commonCount += 1
          stakeAddresses[stakeKey].commonIds.push(foundAssetsWithCommonTraits[idx].onchain_metadata.name)
        } else {
          stakeAddresses[stakeKey] = {
            addresses: [address],
            commonCount: 1,
            commonIds: [foundAssetsWithCommonTraits[idx].onchain_metadata.name],
            rareCount: 0,
            rareIds: [],
          }
        }

        totalCommonCount++
      }
    }

    return await raffleCommonTraits()
  }

  await raffleRareTraits()
  console.log('Raffle assets with rare traits:', totalRareCount)

  await raffleCommonTraits()
  console.log('Raffle assets with common traits:', totalCommonCount)

  const wallets = Object.entries(stakeAddresses).map(([sKey, obj]) => {
    const rareCount = obj.rareCount
    const adaForRares = rareCount * 80

    const commonCount = obj.commonCount
    const adaForCommons = commonCount * 25

    const totalNfts = rareCount + commonCount
    const totalAda = adaForRares + adaForCommons
    const totalLovelace = totalAda * 1000000

    return {
      stakeKey: sKey,
      addresses: obj.addresses,
      rareTraits: {
        count: rareCount,
        assets: obj.rareIds,
        nftRewards: rareCount,
        adaRewards: adaForRares,
      },
      commonTraits: {
        count: commonCount,
        assets: obj.commonIds,
        nftRewards: commonCount,
        adaRewards: adaForCommons,
      },
      payout: {
        totalNfts,
        totalAda,
        totalLovelace,
      },
    }
  })

  fs.writeFileSync(
    './_temp/winning-traits.json',
    JSON.stringify({
      _wen: Date.now(),
      wallets,
    }),
    'utf8'
  )

  const COLUMN_SIZE = [{ width: 60 }, { width: 100 }, { width: 25 }, { width: 25 }, { width: 50 }]
  const HEADER_ROW = [
    { value: 'Stake Key' },
    { value: 'Wallet Address' },
    { value: 'Total ADA' },
    { value: 'Total NFTs' },
    { value: 'Winning Foxes' },
  ]

  const excelRows = [HEADER_ROW]

  wallets.forEach(({ stakeKey, addresses, rareTraits, commonTraits, payout }) => {
    excelRows.push([
      { type: String, value: stakeKey },
      { type: String, value: addresses[0] },
      { type: String, value: String(payout.totalAda) },
      { type: String, value: String(payout.totalNfts) },
      {
        type: String,
        value: `${rareTraits.assets.map((str) => `${str} `)}${commonTraits.assets.map(
          (str) => `${str} `
        )}`.replace(',', ''),
      },
    ])
  })

  await writeXlsxFile(excelRows, {
    columns: COLUMN_SIZE,
    filePath: './_temp/winning-traits.xlsx',
  })

  console.log('Done!')
}

run()
