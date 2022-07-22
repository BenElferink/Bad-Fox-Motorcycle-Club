const axios = require('axios')
const { BLOCKFROST_API } = require('../../constants/api-urls')
const { BLOCKFROST_API_KEY } = require('../../constants/api-keys')

const getAssetsForPage = async (policyId, page) => {
  console.log(`Querying page number ${page}`)

  try {
    const { data } = await axios.get(`${BLOCKFROST_API}/assets/policy/${policyId}?page=${page}`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })

    return data
  } catch (error) {
    console.error(`Error querying page ${page}`)

    return await getAssetsForPage(policyId, page)
  }
}

const getAllAssetIdsFromPolicyId = async (policyId) => {
  const assetIds = []
  console.log(`Fetching all asset IDs from Blockfrost from policy ID: ${policyId}`)

  for (let page = 1; true; page++) {
    const data = await getAssetsForPage(policyId, page)

    if (!data.length) {
      console.log(`All asset IDs fetched, total count: ${assetIds.length}`)
      break
    }

    data.forEach(({ asset }) => {
      if (asset !== policyId) {
        assetIds.push(asset)
      }
    })
  }

  return assetIds
}

module.exports = getAllAssetIdsFromPolicyId
