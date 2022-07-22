const axios = require('axios')
const formatJpgItem = require('../formatters/formatJpgItem')
const { JPG_API } = require('../../constants/api-urls')
const { FOX_POLICY_ID } = require('../../constants/policy-ids')

const fetchJpgRecentItems = (options = {}) => {
  const policyId = options.policyId ?? FOX_POLICY_ID
  const sold = options.sold ?? false
  const page = options.page ?? 1
  const uri = `${JPG_API}/policy/${policyId}/${sold ? 'sales' : 'listings'}?page=${page}`

  return new Promise((resolve, reject) => {
    console.log('fetching from jpg.store')

    axios
      .get(uri)
      .then(({ data: payload }) => {
        console.log(`fetched ${payload.length} items from jpg.store`)

        return resolve(payload.map((item) => formatJpgItem(item)))
      })
      .catch((error) => {
        console.error(error)

        return reject(error)
      })
  })
}

module.exports = fetchJpgRecentItems
