const axios = require('axios')
const formatJpgItem = require('../formatters/formatJpgItem')
const { JPG_API } = require('../../constants/api-urls')
const { FOX_POLICY_ID } = require('../../constants/policy-ids')

const fetchJpgListedItems = (options = {}) => {
  const policyId = options.policyId ?? FOX_POLICY_ID
  const size = options.size ?? 6000
  const uri = `${JPG_API}/search/tokens?policyIds=["${policyId}"]&saleType=buy-now&sortBy=price-low-to-high&verified=default&size=${size}`
  // &saleType=default

  return new Promise((resolve, reject) => {
    console.log('fetching from jpg.store')

    axios
      .get(uri)
      .then(({ data: { tokens: payload } }) => {
        // const listedOnly = payload.filter((item) => item.listing_lovelace > 0)
        console.log(`fetched ${payload.length} items from jpg.store`)

        return resolve(payload.map((item) => formatJpgItem(item)))
      })
      .catch((error) => {
        console.error(error)

        return reject(error)
      })
  })
}

module.exports = fetchJpgListedItems
