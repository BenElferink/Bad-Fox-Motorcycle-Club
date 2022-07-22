require('dotenv').config()
const fs = require('fs')
const assetsFile = require('../data/assets/fox')
const getAllAssetIdsFromPolicyId = require('../functions/blockfrost/getAllAssetIdsFromPolicyId')
const populateAssetFromAssetId = require('../functions/blockfrost/populateAssetFromAssetId')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const POLICY_ID = FOX_POLICY_ID
const ASSET_NAME_PREFIX = 'Bad Fox #'

const run = async () => {
  try {
    const policyAssetIds = await getAllAssetIdsFromPolicyId(POLICY_ID)
    const populatedAssets = assetsFile?.assets ?? []

    for (let idx = 0; idx < policyAssetIds.length; idx++) {
      console.log(`\nLoop index: ${idx}`)
      const assetId = policyAssetIds[idx]

      if (!populatedAssets.find((item) => item.asset === assetId)) {
        const populatedAsset = await populateAssetFromAssetId(assetId)
        populatedAssets.push(populatedAsset)
      }
    }

    console.log('Sorting assets by #ID')
    populatedAssets.sort(
      (a, b) =>
        Number(a.onchain_metadata.name.replace(ASSET_NAME_PREFIX, '')) -
        Number(b.onchain_metadata.name.replace(ASSET_NAME_PREFIX, ''))
    )

    console.log(`Saving ${populatedAssets.length} assets to JSON file`)
    fs.writeFileSync(
      './data/assets/fox.json',
      JSON.stringify({
        _wen: Date.now(),
        policyId: POLICY_ID,
        count: populatedAssets.length,
        assets: populatedAssets,
      }),
      'utf8'
    )

    console.log('Done!')
  } catch (error) {
    console.error(error)
  }
}

run()
