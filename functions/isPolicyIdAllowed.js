import projects from '../data/projects.json'

const isPolicyIdAllowed = (policyId) => {
  if (!policyId) {
    return false
  }

  let isAllowed = false

  for (const proj of projects) {
    if (proj.policyId === policyId) {
      isAllowed = true
    }
  }

  return isAllowed
}

export default isPolicyIdAllowed
