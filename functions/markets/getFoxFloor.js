const foxTraitsJsonFile = require('../../data/traits/fox')
const { jpgStore } = require('../../utils/jpgStore')
const { BAD_FOX_POLICY_ID } = require('../../constants/policy-ids')

const traitsData = (() => {
  const payload = {}

  Object.entries(foxTraitsJsonFile).forEach(([cat, traits]) => {
    payload[cat] = traits.map(({ onChainName }) => onChainName)
  })

  return payload
})()

const getFoxFloor = async () => {
  const floorData = {}
  const listings = await jpgStore.getListings({ policyId: BAD_FOX_POLICY_ID })

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

module.exports = getFoxFloor
