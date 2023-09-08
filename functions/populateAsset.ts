import BadApi from '../utils/badApi'
import type { BadApiRankedToken } from '../utils/badApi'
import type { PolicyId, PopulatedAsset } from '../@types'

const badApi = new BadApi()

let cnftToolsAssets: Partial<Record<PolicyId, BadApiRankedToken[]>> | null = null

const populateAsset: (options: {
  policyId: PolicyId
  assetId: string
  withRanks?: boolean | undefined
  populateMintTx?: boolean | undefined
  firebaseImageUrl?: string | undefined
}) => Promise<PopulatedAsset> = async (options) => {
  const { policyId, assetId, withRanks, populateMintTx, firebaseImageUrl } = options
  console.log(`Populating asset with ID ${assetId}`)

  try {
    const data = await badApi.token.getData(assetId, { populateMintTx })

    if (!cnftToolsAssets) {
      cnftToolsAssets = {}
    }

    if (!cnftToolsAssets[policyId]?.length) {
      cnftToolsAssets[policyId] = (await badApi.policy.getData(policyId, { withRanks, allTokens: true })).tokens
    }

    const rarityRank = cnftToolsAssets[policyId]?.find((item) => item.tokenId === assetId)?.rarityRank || 0

    return {
      ...data,
      isBurned: data.tokenAmount.onChain == 0,
      rarityRank,
      image: {
        ipfs: data.image.ipfs,
        url: firebaseImageUrl || data.image.url || '',
      },
    }
  } catch (error) {
    console.error(`Error populating asset with ID ${assetId}`)

    return await populateAsset(options)
  }
}

export default populateAsset
