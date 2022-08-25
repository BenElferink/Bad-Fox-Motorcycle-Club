require('dotenv').config()
const fs = require('fs')
const { default: axios } = require('axios')
const { blockfrost } = require('../utils/blockfrost')
const assetsFile = require('../data/assets/fox')
const traitsFile = require('../data/traits/fox')
const populateAssetFromAssetId = require('../functions/blockfrost/populateAssetFromAssetId')
const { FOX_POLICY_ID } = require('../constants/policy-ids')
const { JPG_API, JPG_IMAGE_API, CNFT_TOOLS_API, CNFT_TOOLS_IMAGE_API } = require('../constants/api-urls')

const POLICY_ID = FOX_POLICY_ID
const ASSET_NAME_PREFIX = 'Bad Fox #'

let cnftToolsAssets = []

const fetchAssetsFromCnftTools = async (policyId) => {
  console.log(`Fetching assets from cnft.tools with policy ID ${policyId}`)

  try {
    const { data } = await axios.get(`${CNFT_TOOLS_API}/external/${policyId}`)

    return data
  } catch (error) {
    console.error(`Error fetching assets from cnft.tools with policy ID ${policyId}`)

    return await fetchAssetsFromCnftTools(policyId)
  }
}

const fetchAssetFromJpgStore = async (policyId, assetNumber) => {
  console.log(`Fetching asset from jpg.store with serial #${assetNumber}`)

  try {
    const { data } = await axios.get(
      `${JPG_API}/search/tokens?policyIds=["${policyId}"]&saleType=default&verified=default&sortBy=price-low-to-high&size=1&nameQuery=${assetNumber}`
    )

    return data
  } catch (error) {
    console.error(`Error fetching asset from jpg.store with serial #${assetNumber}`)

    return await fetchAssetFromJpgStore(policyId, assetNumber)
  }
}

const populateAssetFromAssetId = async (assetId) => {
  console.log(`Populating asset with ID ${assetId}`)

  try {
    const data = await blockfrost.getAssetWithAssetId(assetId)

    if (!cnftToolsAssets.length) {
      cnftToolsAssets = await fetchAssetsFromCnftTools(data.policy_id)
    }

    const jpgData = await fetchAssetFromJpgStore(data.policy_id, data.onchain_metadata.name.split('#')[1])
    const cnftToolsData = cnftToolsAssets.find((item) => item.name === data.onchain_metadata.name)

    const ipfsImageUrl = data.onchain_metadata.image[0]
    const jpgImageUrl = `${JPG_IMAGE_API}/${jpgData.tokens[0].optimized_source}1200x`
    const cnftToolsImageUrl = `${CNFT_TOOLS_IMAGE_API}/badfoxmotorcycleclub/${cnftToolsData.iconurl}`

    const rank = Number(cnftToolsData.rarityRank)

    return {
      ...data,
      onchain_metadata: {
        ...data.onchain_metadata,
        rank,
        image: {
          ipfs: ipfsImageUrl,
          jpgStore: jpgImageUrl,
          cnftTools: cnftToolsImageUrl,
        },
      },
    }
  } catch (error) {
    console.error(`Error populating asset with ID ${assetId}`)

    return await populateAssetFromAssetId(assetId)
  }
}

const countTraits = (assets) => {
  const traits = {}
  const numOfAssets = assets.length

  Object.entries(traitsFile).forEach(([category, attributes]) => {
    attributes.forEach((attributeObj) => {
      const label = attributeObj.label
      const gender = attributeObj.gender
      const prefix = gender === 'Male' ? '(M) ' : gender === 'Female' ? '(F) ' : '(U) '

      const labelCount = assets.filter(
        (item) => label === item.onchain_metadata.attributes[category].replace(prefix, '')
      ).length

      const payload = {
        ...attributeObj,
        count: labelCount,
        percent: `${(labelCount / (numOfAssets / 100)).toFixed(2)}%`,
      }

      if (traits[category]) {
        traits[category].push(payload)
      } else {
        traits[category] = [payload]
      }
    })
  })

  Object.entries(traits).forEach(([key, val]) => {
    traits[key] = val.sort((a, b) => a.count - b.count)
  })

  fs.writeFileSync('./data/traits/fox.json', JSON.stringify(traits), 'utf8')
}

const run = async () => {
  try {
    const policyAssetIds = await blockfrost.getAssetIdsWithPolicyId(POLICY_ID)
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

    countTraits(populatedAssets)

    console.log('Done!')
  } catch (error) {
    console.error(error)
  }
}

run()
