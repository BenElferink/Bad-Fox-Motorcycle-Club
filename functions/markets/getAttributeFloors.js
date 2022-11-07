const { jpgStore } = require('../../utils/jpgStore')
const getFileForPolicyId = require('../getFileForPolicyId')

const getAttributes = (policyId) => {
  const payload = {}

  Object.entries(getFileForPolicyId(policyId, 'traits')).forEach(([cat, traits]) => {
    payload[cat] = traits.map(({ onChainName }) => onChainName)
  })

  return payload
}

const getAttributeFloors = async (policyId) => {
  const floorData = {}
  const traitsData = getAttributes(policyId)
  const listings = await jpgStore.getListings({ policyId })

  console.log('Searching for floor prices')
  for (const category in traitsData) {
    // console.log('Looping through category', category)
    const traits = traitsData[category]
    for (const trait of traits) {
      // console.log('Searching floor for trait', trait)

      for (const { attributes, price } of listings) {
        if (attributes[category] === trait) {
          // console.log('Found floor', price)

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

  // console.log('Found all floor prices', floorData)
  console.log('Found all floor prices')
  return floorData
}

module.exports = getAttributeFloors
