const { BEAR_POLICY_ID } = require('../../constants/policy-ids')
const fetchJpgListedItems = require('./fetchJpgListedItems')
const bearsTraitsJsonFile = require('../../data/traits/bears')

const getBearsFloor = async () => {
  const floorData = {}
  const fetchedData = await fetchJpgListedItems({ policyId: BEAR_POLICY_ID })

  for (const type of bearsTraitsJsonFile.types) {
    let thisFloor = null

    for (const listing of fetchedData) {
      if (listing.traits['attributes / Type'].toLowerCase() === type.toLowerCase()) {
        thisFloor = Number(listing.listing_lovelace) / 1000000
        break
      }
    }

    console.log(`found floor for ${type}! floor is ${thisFloor}`)
    floorData[type] = { floor: thisFloor, timestamp: Date.now() }
  }

  return floorData
}

module.exports = getBearsFloor
