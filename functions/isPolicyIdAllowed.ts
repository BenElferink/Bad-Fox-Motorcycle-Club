import { PolicyId } from '../@types'
import projects from '../data/projects.json'

const isPolicyIdAllowed = (policyId: PolicyId | '', key?: 'collections' | 'traits') => {
  let isAllowed = false

  if (!policyId) {
    return isAllowed
  }

  for (const proj of projects) {
    if (proj.policyId === policyId && (!key || !!proj[key])) {
      isAllowed = true
    }
  }

  return isAllowed
}

export default isPolicyIdAllowed
