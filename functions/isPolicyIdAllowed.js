const projects = require('../data/projects.json')

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

module.exports = isPolicyIdAllowed
