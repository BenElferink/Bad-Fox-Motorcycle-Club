import axios from 'axios'
import getFileForPolicyId from '../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../functions/formatters/formatIpfsImageUrl'
import { BAD_FOX_POLICY_ID } from '../constants/policy-ids'

const ONE_MILLION = 1000000

class JpgStore {
  constructor() {
    this.baseUrl = 'https://server.jpgstoreapis.com'
  }

  getRecents = (options = {}) => {
    const policyId = options.policyId ?? BAD_FOX_POLICY_ID
    const sold = options.sold ?? false
    const page = options.page ?? 1
    const uri = `${this.baseUrl}/policy/${policyId}/${sold ? 'sales' : 'listings'}?page=${page}`

    return new Promise(async (resolve, reject) => {
      console.log(
        `Fetching recent ${sold ? 'sales' : 'listings'} from jpg.store at page ${page} for policy ID ${policyId}`
      )

      try {
        const { data } = await axios.get(uri, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        const policyAssets = getFileForPolicyId(policyId, 'assets')
        const payload = data
          .map((item) => {
            const asset = policyAssets.find((asset) => asset.assetId === item.asset_id)

            return {
              assetId: item.asset_id,
              name: item.display_name,
              price: item.price_lovelace / ONE_MILLION,
              rank: asset.rarityRank,
              attributes: asset.attributes,
              imageUrl: formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank),
              itemUrl: `https://jpg.store/asset/${item.asset_id}`,
              date: new Date(sold ? item.confirmed_at : item.listed_at),
            }
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        console.log(`Fetched ${payload.length} items from jpg.store`)

        return resolve(payload)
      } catch (e) {
        return reject(e)
      }
    })
  }

  // https://api.opencnft.io/1/policy/fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967
  // https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd

  getListings = (policyId) => {
    const maxSize = 100
    const uri = `${this.baseUrl}/search/tokens?policyIds=["${policyId}"]&traits={}&nameQuery=&verified=default&listingTypes=["SINGLE_ASSET"]&saleType=buy-now&sortBy=price-low-to-high&size=${maxSize}` // &onlyMainBundleAsset=false
    // listingTypes = "SINGLE_ASSET" || "BUNDLE" || "ALL_LISTINGS"

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching listings from jpg.store for policy ID ${policyId}`)

      try {
        let totalToFetch = 0
        let pagination = {}
        let fetchedListings = []

        for (let i = 0; true; i++) {
          const { data } = await axios.get(`${uri}&pagination=${JSON.stringify(pagination)}`, {
            headers: {
              'Accept-Encoding': 'application/json',
            },
          })

          // only on 1st loop
          if (!totalToFetch) {
            totalToFetch = data.pagination.total
          }

          // listings changed, reset and start again
          if (totalToFetch !== data.pagination.total) {
            totalToFetch = 0
            pagination = {}
            fetchedListings = []
          }

          // add paginated data to fetched data
          else if (fetchedListings.length < totalToFetch) {
            pagination = data.pagination
            fetchedListings = fetchedListings.concat(data.tokens)

            // all paginated tiems fetched, break loop
            if (fetchedListings.length >= totalToFetch) {
              break
            }
          }
        }

        const payload = fetchedListings.map((item) => ({
          assetId: item.asset_id,
          name: item.display_name,
          price: Number(item.listing_lovelace) / ONE_MILLION,
          itemUrl: `https://jpg.store/asset/${item.asset_id}`,
          date: new Date(item.listed_at),
        }))

        console.log(`Fetched ${payload.length} listings from jpg.store`)

        return resolve(payload)
      } catch (e) {
        return reject(e)
      }
    })
  }

  getFloorPrices = async (policyId) => {
    const floorData = {}
    const traitsData = {}

    const policyAssets = getFileForPolicyId(policyId, 'assets')
    const policyTraits = getFileForPolicyId(policyId, 'traits')

    Object.entries(policyTraits).forEach(([cat, traits]) => {
      traitsData[cat] = traits.map(({ onChainName }) => onChainName)
    })

    const listings = await this.getListings(policyId)

    console.log('Detecting floor prices for every attribute')

    for (const category in traitsData) {
      // Looping through categories

      const traits = traitsData[category]
      for (const trait of traits) {
        // Looping through category traits

        for (const { assetId, price } of listings) {
          const asset = policyAssets.find((asset) => asset.assetId === assetId)

          if (asset.attributes[category] === trait) {
            // Found floor price for this trait

            if (!floorData[category]) {
              floorData[category] = { [trait]: price }
            } else {
              floorData[category][trait] = price
            }

            break
          }
        }
      }
    }

    console.log('Found all floor prices')

    return floorData
  }

  getAssetPurchasePrice = (assetId, walletAddress) => {
    const uri = `${this.baseUrl}/token/${assetId}/tx-history?limit=50&offset=0`

    return new Promise(async (resolve, reject) => {
      console.log(
        `Fetching tx history from jpg.store for asset ID ${assetId}${
          walletAddress ? ` strictly for signing wallet address ${walletAddress}` : ''
        }`
      )

      try {
        const { data } = await axios.get(uri, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        let boughtAtPrice = 0
        let boughtAtTimestamp = 0

        for (let i = 0; i < data.txs.length; i++) {
          const tx = data.txs[i]

          if (tx.action === 'BUY' && (!walletAddress || walletAddress === tx.signer_address)) {
            boughtAtPrice = tx.amount_lovelace / ONE_MILLION
            boughtAtTimestamp = new Date(tx.created_at).getTime()
            break
          }
        }

        console.log(`Fetched price ${boughtAtPrice} with timestamp ${boughtAtTimestamp} from jpg.store`)

        return resolve({
          price: boughtAtPrice,
          timestamp: boughtAtTimestamp,
        })
      } catch (e) {
        return reject(e)
      }
    })
  }
}

const jpgStore = new JpgStore()

export default jpgStore
