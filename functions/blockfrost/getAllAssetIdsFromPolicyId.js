const blockfrost = require('../../utils/blockfrost')

const getAllAssetIdsFromPolicyId = async (policyId) => {
  console.log(`Fetching all asset IDs from Blockfrost from policy ID: ${policyId}`)

  const assetIds = []
  const data = await blockfrost.assetsPolicyByIdAll(policyId)

  data.forEach(({ asset }) => {
    if (asset !== policyId) {
      assetIds.push(asset)
    }
  })

  console.log(`All asset IDs fetched, total count: ${assetIds.length}`)

  return assetIds
}

module.exports = getAllAssetIdsFromPolicyId
