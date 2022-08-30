require('dotenv').config()
const fs = require('fs')
const writeXlsxFile = require('write-excel-file/node')
const { blockfrost } = require('../utils/blockfrost')
const foxAssetsFile = require('../data/assets/fox')
const { EXCLUDE_ADDRESSES } = require('../constants/addresses')

const WINNERS_COUNT = 30
const ADA_PER_WIN = 50
const NFT_PER_WIN = 1

const INCLUDED_TRAITS = [
  { Eyewear: '(F) Fire Shades' },
  { Eyewear: '(M) Pink Luxury Shades' },
  { Skin: '(F) Zombie' },
  { Skin: '(M) Zombie' },
]

const run = async () => {
  const stakeAddresses = {}
  const foundAssetsWithIncludedTraits = []

  foxAssetsFile.assets.forEach((item) => {
    INCLUDED_TRAITS.forEach((traitItem) => {
      Object.entries(traitItem).forEach(([key, val]) => {
        if (item.attributes[key] === val) {
          foundAssetsWithIncludedTraits.push(item)
        }
      })
    })
  })

  console.log('Found assets with included traits:', foundAssetsWithIncludedTraits.length)

  const usedIndexes = []
  const getIndex = (max) => {
    const idx = Math.floor(Math.random() * max)
    const alreadyUsedIndex = usedIndexes.find((num) => num === idx) != null

    return [idx, alreadyUsedIndex]
  }

  const getKeysForAssetId = async (assetId) => {
    const address = await blockfrost.getWalletAddressWithAssetId(assetId)

    if (!EXCLUDE_ADDRESSES.includes(address)) {
      const existingStakeKeyArr = Object.entries(stakeAddresses).filter(([sKey, obj]) =>
        obj.addresses.includes(address)
      )

      if (existingStakeKeyArr.length) {
        return [address, existingStakeKeyArr[0][0]]
      } else {
        return [address, await blockfrost.getStakeKeyWithWalletAddress(address)]
      }
    } else {
      return [address, null]
    }
  }

  let raffledCount = 0
  const raffleTraits = async () => {
    if (raffledCount === WINNERS_COUNT) {
      return
    }

    const [idx, alreadyUsedIndex] = getIndex(foundAssetsWithIncludedTraits.length)

    if (!alreadyUsedIndex) {
      usedIndexes.push(idx)
      const [address, stakeKey] = await getKeysForAssetId(foundAssetsWithIncludedTraits[idx].assetId)

      if (stakeKey) {
        if (stakeAddresses[stakeKey]) {
          const addressAlreadyExists = stakeAddresses[stakeKey].addresses.find((str) => str === address)
          if (!addressAlreadyExists) {
            stakeAddresses[stakeKey].addresses.push(address)
          }

          stakeAddresses[stakeKey].traitCount += 1
          stakeAddresses[stakeKey].assetNames.push(foundAssetsWithIncludedTraits[idx].displayName)
        } else {
          stakeAddresses[stakeKey] = {
            addresses: [address],
            traitCount: 1,
            assetNames: [foundAssetsWithIncludedTraits[idx].displayName],
          }
        }

        raffledCount++
      }
    }

    return await raffleTraits()
  }

  await raffleTraits()
  console.log('Raffled assets with included traits:', raffledCount)

  const wallets = Object.entries(stakeAddresses).map(([sKey, obj]) => ({
    stakeKey: sKey,
    addresses: obj.addresses,
    winningNfts: obj.assetNames,
    payout: {
      ada: obj.traitCount * ADA_PER_WIN,
      nft: obj.traitCount * NFT_PER_WIN,
    },
  }))

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

  wallets.forEach(({ stakeKey, addresses, winningNfts, payout }) => {
    excelRows.push([
      { type: String, value: stakeKey },
      { type: String, value: addresses[0] },
      { type: String, value: String(payout.ada) },
      { type: String, value: String(payout.nft) },
      {
        type: String,
        value: `${winningNfts.map((str) => `${str} `)}`.replace(',', ''),
      },
    ])
  })

  await writeXlsxFile(excelRows, {
    columns: COLUMN_SIZE,
    filePath: './_temp/winning-traits-week5.xlsx',
  })

  console.log('Done!')
}

run()
