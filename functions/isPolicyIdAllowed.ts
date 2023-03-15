import { PolicyId } from '../@types'
import collections from '../data/collections.json'

const isPolicyIdAllowed = (policyId: PolicyId | '', key?: 'collections' | 'traits') => {
  let isAllowed = false

  if (!policyId) {
    return isAllowed
  }

  for (const coll of collections) {
    if (coll.policyId === policyId && (!key || !!coll[key])) {
      isAllowed = true
    }
  }

  return isAllowed
}

export default isPolicyIdAllowed
