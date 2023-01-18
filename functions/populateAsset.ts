import blockfrost from '../utils/blockfrost'
import CnftTools, { FormattedRankedAsset } from '../utils/cnftTools'
import fromHex from './formatters/hex/fromHex'
import { AssetIncludedFile, PolicyId, PopulatedAsset } from '../@types'

const cnftTools = new CnftTools()
let cnftToolsAssets: Partial<Record<PolicyId, FormattedRankedAsset[]>> | null = null

const populateAsset: (options: {
  policyId: PolicyId
  assetId: string
  withRanks?: boolean | undefined
  firebaseImageUrl?: string | undefined
}) => Promise<PopulatedAsset> = async (options) => {
  const { policyId, assetId, withRanks, firebaseImageUrl } = options
  console.log(`Populating asset with ID ${assetId}`)

  try {
    const data = await blockfrost.getAssetWithAssetId(assetId)

    let rarityRank = 0

    if (!!withRanks) {
      if (!cnftToolsAssets) {
        cnftToolsAssets = {}
      }

      if (!cnftToolsAssets[policyId]?.length) {
        cnftToolsAssets[policyId] = await cnftTools.getRankedAssets(policyId)
      }

      rarityRank = Number(cnftToolsAssets[policyId]?.find((item) => item.assetId === assetId)?.rank || 0)
    }

    const ipfsReference =
      typeof data.onchain_metadata?.image === 'string'
        ? data.onchain_metadata?.image
        : typeof data.onchain_metadata?.image === 'object'
        ? ((data.onchain_metadata?.image as string[]) || []).join('')
        : 'unknown'

    return {
      assetId: data.asset,
      fingerprint: data.fingerprint,
      isBurned: data.quantity === '0',
      onChainName: fromHex(data.asset_name || ''),
      displayName: (data.onchain_metadata?.name as string) || '',
      serialNumber: Number(((data.onchain_metadata?.name as string) || '#0').split('#')[1]),
      rarityRank,
      attributes: (data.onchain_metadata?.attributes as Record<string, string>) || {},
      image: {
        ipfs: ipfsReference.indexOf('ipfs://') === 0 ? ipfsReference : `ipfs://${ipfsReference}`,
        firebase: firebaseImageUrl || '',
      },
      files: (data.onchain_metadata?.files as AssetIncludedFile[]) || [],
    }
  } catch (error) {
    console.error(`Error populating asset with ID ${assetId}`)

    return await populateAsset(options)
  }
}

export default populateAsset
