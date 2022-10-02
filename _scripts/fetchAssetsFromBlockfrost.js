require('dotenv').config()
const fs = require('fs')
const { default: axios } = require('axios')
const { blockfrost } = require('../utils/blockfrost')
const getFileForPolicyId = require('../functions/getFileForPolicyId')
const fromHex = require('../functions/formatters/hex/fromHex')
const { BAD_FOX_POLICY_ID } = require('../constants/policy-ids')
const { CNFT_TOOLS_API } = require('../constants/api-urls')

const POLICY_ID = BAD_FOX_POLICY_ID
const ASSET_DISPLAY_NAME_PREFIX = 'Bad Fox #'
const JSON_FILE_NAME = 'bad-fox.json'
const SHOULD_COUNT_TRAITS = true
const HAS_RANKS_ON_CNFT_TOOLS = true

let cnftToolsAssets = []
const traitsFile = getFileForPolicyId(POLICY_ID, 'traits')
const populatedAssets = getFileForPolicyId(POLICY_ID, 'assets')

const populateNewAsset = async (assetId) => {
  let rarityRank = 0

  if (HAS_RANKS_ON_CNFT_TOOLS && !cnftToolsAssets.length) {
    cnftToolsAssets = (await axios.get(`${CNFT_TOOLS_API}/external/${POLICY_ID}`)).data
    rarityRank = Number(cnftToolsAssets.find((item) => item.name === data.onchain_metadata.name)?.rarityRank || 0)
  }

  console.log(`Populating asset with ID ${assetId}`)

  try {
    const data = await blockfrost.getAssetWithAssetId(assetId)

    return {
      assetId: data.asset,
      fingerprint: data.fingerprint,
      onChainName: fromHex(data.asset_name),
      displayName: data.onchain_metadata.name,
      serialNumber: Number(data.onchain_metadata.name.replace(ASSET_DISPLAY_NAME_PREFIX, '')),
      rarityRank,
      attributes: data.onchain_metadata.attributes,
      image: {
        ipfs: data.onchain_metadata.image[0],
      },
      // files: data.onchain_metadata.files || [],
    }
  } catch (error) {
    console.error(`Error populating asset with ID ${assetId}`)

    return await populateNewAsset(assetId)
  }
}

const countTraits = (assets) => {
  const traits = {}
  const numOfAssets = assets.length

  Object.entries(traitsFile).forEach(([category, attributes]) => {
    attributes.forEach((trait) => {
      const labelCount = assets.filter((item) => item.attributes[category] === trait.onChainName).length

      const payload = {
        ...trait,
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

  fs.writeFileSync(`./data/traits/${JSON_FILE_NAME}`, JSON.stringify(traits), 'utf8')
}

const run = async () => {
  try {
    const policyAssetIds = await blockfrost.getAssetIdsWithPolicyId(POLICY_ID)

    for (let idx = 0; idx < policyAssetIds.length; idx++) {
      console.log(`\nLoop index: ${idx}`)
      const assetId = policyAssetIds[idx]

      if (!populatedAssets.find((item) => item.assetId === assetId)) {
        const populatedAsset = await populateNewAsset(assetId)
        populatedAssets.push(populatedAsset)
      }
    }

    console.log('Sorting assets by serial number')
    populatedAssets.sort((a, b) => a.serialNumber - b.serialNumber)

    console.log(`Saving ${populatedAssets.length} assets to JSON file`)
    fs.writeFileSync(
      `./data/assets/${JSON_FILE_NAME}`,
      JSON.stringify({
        _wen: Date.now(),
        policyId: POLICY_ID,
        count: populatedAssets.length,
        assets: populatedAssets,
      }),
      'utf8'
    )

    if (SHOULD_COUNT_TRAITS) {
      countTraits(populatedAssets)
    }

    console.log('Done!')
  } catch (error) {
    console.error(error)
  }
}

run()
