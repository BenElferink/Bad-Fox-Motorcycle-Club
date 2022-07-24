const axios = require('axios')
const { JPG_API, JPG_IMAGE_API, CNFT_TOOLS_API, CNFT_TOOLS_IMAGE_API } = require('../../constants/api-urls')
const blockfrost = require('../../utils/blockfrost')

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
    const data = await blockfrost.assetsById(assetId)

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

module.exports = populateAssetFromAssetId
