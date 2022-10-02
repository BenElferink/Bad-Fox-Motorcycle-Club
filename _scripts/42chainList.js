require('dotenv').config()
const writeXlsxFile = require('write-excel-file/node')
const { blockfrost } = require('../utils/blockfrost')
const foxAssetsFile = require('../data/assets/fox')
const { EXCLUDE_ADDRESSES } = require('../constants/addresses')

const COLUMN_SIZE = [{ width: 25 }, { width: 100 }]
const HEADER_ROW = [{ value: 'Airdrop Count' }, { value: 'Wallet Address' }]

const INCLUDED_TRAITS = [{ Eyewear: '(M) Big Shades' }, { Clothes: '(M) Sport Jacket' }]

const run = async () => {
  const wallets = [HEADER_ROW]
  let mints = 0

  const stakeKeysObject = {}
  const assetsWithIncludedTraits = []

  foxAssetsFile.assets.forEach((item) => {
    INCLUDED_TRAITS.forEach((traitItem) => {
      Object.entries(traitItem).forEach(([key, val]) => {
        if (item.attributes[key] === val) {
          assetsWithIncludedTraits.push(item)
        }
      })
    })
  })

  console.log('Found assets with included traits:', assetsWithIncludedTraits.length)

  const getKeysForAssetId = async (assetId) => {
    const address = await blockfrost.getWalletAddressWithAssetId(assetId)

    if (!EXCLUDE_ADDRESSES.includes(address)) {
      const existingStakeKeyArr = Object.entries(stakeKeysObject).filter(([sKey, obj]) =>
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

  for (let i = 0; i < assetsWithIncludedTraits.length; i++) {
    const asset = assetsWithIncludedTraits[i]
    const [address, stakeKey] = await getKeysForAssetId(asset.assetId)

    if (stakeKey) {
      if (stakeKeysObject[stakeKey]) {
        const addressAlreadyExists = stakeKeysObject[stakeKey].addresses.find((str) => str === address)
        if (!addressAlreadyExists) {
          stakeKeysObject[stakeKey].addresses.push(address)
        }

        stakeKeysObject[stakeKey].traitCount += 1
        stakeKeysObject[stakeKey].assetNames.push(asset.displayName)
      } else {
        stakeKeysObject[stakeKey] = {
          addresses: [address],
          traitCount: 1,
          assetNames: [asset.displayName],
        }
      }

      mints++
    }
  }

  console.log('Found wallets with included assets:', Object.keys(stakeKeysObject).length)

  Object.values(stakeKeysObject).forEach(({ addresses, traitCount }, idx) => {
    wallets.push([
      { type: String, value: String(traitCount) },
      { type: String, value: addresses[0] },
    ])
  })

  wallets.push([
    { type: String, value: '1' },
    {
      type: String,
      value:
        'addr1q9p9yq4lz834729chxsdwa7utfp5wr754zkn6hltxz42m594guty04nldwlxnhw8xcgd5pndaaqzzu5qzyvnc8tlgdsqtazkyh',
    },
  ])

  wallets.push([
    { type: String, value: String(150 - mints - 1) },
    {
      type: String,
      value:
        'addr1q9lxkc7exdjcaamn5uyz06admz4flmrzxx4kwrwgt6vsn53v46z6xpamcr25d27qt50jeafah5yk7mj4cus46500u6hsgkkyam',
    },
  ])

  console.log('Total wallets in spreadsheet:', wallets.length - 1)

  await writeXlsxFile(wallets, {
    columns: COLUMN_SIZE,
    filePath: './_temp/42-chain-list.xlsx',
  })

  console.log('done!')
}

run()
