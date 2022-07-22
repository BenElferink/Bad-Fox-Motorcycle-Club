const fetchJpgListedItems = require('./fetchJpgListedItems')
const { FOX_POLICY_ID } = require('../../constants/policy-ids')

const genders = ['Male', 'Female']

const getFoxFloor = async () => {
  const floorData = []
  const fetchedData = await fetchJpgListedItems({ policyId: FOX_POLICY_ID })

  console.log('Searching for floor prices')
  for (const gender of genders) {
    let thisFloor = null

    for (const listing of fetchedData) {
      if (listing.attributes['Gender'] === gender) {
        thisFloor = listing.price
        break
      }
    }

    console.log(`Found floor for ${gender} - ${thisFloor}`)
    floorData.push({ type: gender, price: thisFloor, timestamp: Date.now() })
  }

  console.log('Found all floor prices')
  return floorData
}

module.exports = getFoxFloor
