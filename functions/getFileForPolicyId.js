const { BAD_FOX_POLICY_ID } = require('../constants/policy-ids')
const badFoxAssetsFile = require('../data/assets/bad-fox.json')
const badFoxTraitsFile = require('../data/traits/bad-fox.json')

const getFileForPolicyId = (policyId, fileType) => {
  switch (fileType) {
    case 'assets':
      return policyId === BAD_FOX_POLICY_ID ? badFoxAssetsFile.assets : []

    case 'traits':
      return policyId === BAD_FOX_POLICY_ID ? badFoxTraitsFile : {}

    default:
      return null
  }
}

module.exports = getFileForPolicyId
