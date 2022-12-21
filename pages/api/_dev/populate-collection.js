const fs = require('fs')
const blockfrost = require('../../../utils/blockfrost').default
const getFileForPolicyId = require('../../../functions/getFileForPolicyId').default
const populateAsset = require('../../../functions/populateAsset')
const {
  ADMIN_CODE,
  BAD_FOX_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
  BAD_KEY_POLICY_ID,
  FOURTY_TWO_CHAIN_POLICY_ID,
} = require('../../../constants')

const POLICY_ID = BAD_KEY_POLICY_ID
const JSON_FILE_NAME = 'bad-key.json'
const SHOULD_COUNT_TRAITS = false
const HAS_RANKS_ON_CNFT_TOOLS = false

const traitsFile = getFileForPolicyId(POLICY_ID, 'traits')
const assetsFile = getFileForPolicyId(POLICY_ID, 'assets')

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

const handler = async (req, res) => {
  const { method, headers, query } = req

  const adminCode = headers.admin_code || query.admin_code

  if (adminCode !== ADMIN_CODE) {
    return res.status(401).end()
  }

  try {
    switch (method) {
      case 'GET': {
        const policyAssetIds = await blockfrost.getAssetIdsWithPolicyId(POLICY_ID)
        const populate = (await populateAsset).default

        for (let idx = 0; idx < policyAssetIds.length; idx++) {
          console.log(`\nLoop index: ${idx}`)
          const assetId = policyAssetIds[idx]
          const foundIdx = assetsFile.findIndex((item) => item.assetId === assetId)

          if (foundIdx === -1) {
            const populatedAsset = await populate({
              policyId: POLICY_ID,
              assetId,
              withRanks: HAS_RANKS_ON_CNFT_TOOLS,
            })
            assetsFile.push(populatedAsset)
          } else {
            const updatedAsset = await populate({
              policyId: POLICY_ID,
              assetId,
              withRanks: HAS_RANKS_ON_CNFT_TOOLS,
              firebaseImageUrl: assetsFile[foundIdx]?.image?.firebase,
            })
            assetsFile[foundIdx] = updatedAsset
          }
        }

        console.log('Sorting assets by serial number')
        assetsFile.sort((a, b) => a.serialNumber - b.serialNumber)

        console.log(`Saving ${assetsFile.length} assets to JSON file`)

        const payload = {
          _wen: Date.now(),
          policyId: POLICY_ID,
          count: assetsFile.length,
          assets: assetsFile,
        }

        fs.writeFileSync(`./data/assets/${JSON_FILE_NAME}`, JSON.stringify(payload), 'utf8')

        if (SHOULD_COUNT_TRAITS) {
          countTraits(assetsFile)
        }

        console.log('Done!')

        return res.status(200).json(payload)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

module.exports = handler
