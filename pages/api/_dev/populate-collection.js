const fs = require('fs')
const axios = require('axios')
const blockfrost = require('../../../utils/blockfrost').default
const fromHex = require('../../../functions/formatters/hex/fromHex').default
const getFileForPolicyId = require('../../../functions/getFileForPolicyId').default
const {
  ADMIN_CODE,
  BAD_FOX_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
  FOURTY_TWO_CHAIN_POLICY_ID,
} = require('../../../constants')

const POLICY_ID = FOURTY_TWO_CHAIN_POLICY_ID
const ASSET_DISPLAY_NAME_PREFIX = '42 Chain #'
const JSON_FILE_NAME = '42-chain.json'
const SHOULD_COUNT_TRAITS = false
const HAS_RANKS_ON_CNFT_TOOLS = false

let cnftToolsAssets = []
const traitsFile = getFileForPolicyId(POLICY_ID, 'traits')
const populatedAssets = getFileForPolicyId(POLICY_ID, 'assets')

const populateNewAsset = async (assetId) => {
  console.log(`Populating asset with ID ${assetId}`)

  try {
    const data = await blockfrost.getAssetWithAssetId(assetId)

    let rarityRank = 0

    if (HAS_RANKS_ON_CNFT_TOOLS) {
      if (!cnftToolsAssets.length) {
        cnftToolsAssets = (
          await axios.get(`https://api.cnft.tools/api/external/${POLICY_ID}`, {
            headers: {
              'Accept-Encoding': 'application/json',
            },
          })
        ).data
      }

      rarityRank = Number(
        cnftToolsAssets.find((item) => item.name === data.onchain_metadata.name)?.rarityRank || 0
      )
    }

    const ipfsReference =
      typeof data.onchain_metadata.image === 'string'
        ? data.onchain_metadata.image
        : typeof data.onchain_metadata.image === 'object'
        ? data.onchain_metadata.image.join('')
        : 'unknown'

    return {
      assetId: data.asset,
      fingerprint: data.fingerprint,
      isBurned: data.quantity === '0',
      onChainName: fromHex(data.asset_name),
      displayName: data.onchain_metadata.name,
      serialNumber: Number(data.onchain_metadata.name.replace(ASSET_DISPLAY_NAME_PREFIX, '')),
      rarityRank,
      attributes: data.onchain_metadata.attributes,
      image: {
        ipfs: ipfsReference,
      },
      files: data.onchain_metadata.files || [],
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

module.exports = async (req, res) => {
  const { method, headers, query } = req

  const adminCode = headers.admin_code || query.admin_code

  if (adminCode !== ADMIN_CODE) {
    return res.status(401).end()
  }

  try {
    switch (method) {
      case 'GET': {
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

        const payload = {
          _wen: Date.now(),
          policyId: POLICY_ID,
          count: populatedAssets.length,
          assets: populatedAssets,
        }

        fs.writeFileSync(`./data/assets/${JSON_FILE_NAME}`, JSON.stringify(payload), 'utf8')

        if (SHOULD_COUNT_TRAITS) {
          countTraits(populatedAssets)
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
