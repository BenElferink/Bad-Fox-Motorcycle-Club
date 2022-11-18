const { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } = require('../constants/policy-ids')
const badFoxAssetsFile = require('../data/assets/bad-fox.json')
const badMotorcycleAssetsFile = require('../data/assets/bad-motorcycle.json')
const badFoxTraitsFile = require('../data/traits/bad-fox.json')
const badMotorcycleTraitsFile = require('../data/traits/bad-motorcycle.json')

const getFileForPolicyId = (policyId, fileType) => {
  switch (fileType) {
    case 'assets':
      return policyId === BAD_FOX_POLICY_ID
        ? badFoxAssetsFile?.assets || []
        : policyId === BAD_MOTORCYCLE_POLICY_ID
        ? badMotorcycleAssetsFile?.assets || []
        : []

    case 'traits':
      return policyId === BAD_FOX_POLICY_ID
        ? badFoxTraitsFile
        : policyId === BAD_MOTORCYCLE_POLICY_ID
        ? badMotorcycleTraitsFile
        : {}

    default:
      return null
  }
}

module.exports = getFileForPolicyId
