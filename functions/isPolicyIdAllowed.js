import POLICY_IDS from '../constants/policy-ids'

const isPolicyIdAllowed = (policyId) => {
  if (!policyId) {
    return false
  }

  if (!Object.values(POLICY_IDS).includes(policyId)) {
    return false
  }

  return true
}

export default isPolicyIdAllowed
