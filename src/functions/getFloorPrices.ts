import badLabsApi from '../utils/badLabsApi'
import getFileForPolicyId from './getFileForPolicyId'
import type { FloorPrices, PolicyId, PopulatedAsset, TraitsFile } from '../@types'

const getFloorPrices = async (
  policyId: PolicyId
): Promise<{
  baseFloor: number
  attributesFloor: FloorPrices
}> => {
  const floorData: FloorPrices = {}
  const traitsData: Record<string, string[]> = {}

  const policyAssets = getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]
  const policyTraits = getFileForPolicyId(policyId, 'traits') as TraitsFile

  Object.entries(policyTraits).forEach(([cat, traits]) => {
    traitsData[cat] = traits.map(({ onChainName }) => onChainName)
  })

  const listings = (await badLabsApi.policy.market.getData(policyId)).items

  console.log('Detecting floor prices for every attribute')

  for (const category in traitsData) {
    // Looping through categories

    const traits = traitsData[category]
    for (const trait of traits) {
      // Looping through category traits

      for (const { tokenId, price } of listings) {
        // Lisitng sare already sorted by price, cheapest 1st
        const asset = policyAssets.find((asset) => asset.tokenId === tokenId)

        if (asset?.attributes[category] === trait) {
          // Found floor price for this trait

          if (!floorData[category]) {
            floorData[category] = { [trait]: price }
          } else {
            floorData[category][trait] = price
          }

          break
        }
      }
    }
  }

  console.log('Found all floor prices')

  return {
    baseFloor: listings[0]?.price || 0,
    attributesFloor: floorData,
  }
}

export default getFloorPrices
