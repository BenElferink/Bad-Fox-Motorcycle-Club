import axios from 'axios'
import sleep from '../functions/sleep'
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

        const payload = data
          .map((item) => {
            const asset = getFileForPolicyId(policyId, 'assets').find((asset) => asset.assetId === item.asset_id)

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
        // sold = false
        // [
        //   {
        //     asset_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7832353230',
        //     display_name: 'Bad Fox #2520',
        //     tx_hash: '1a8cee3c96e7a46da0d9482ae0172d87c5e38c4d5f9dce6c68be8eacb9d575b9',
        //     listing_id: 20638802,
        //     listed_at: '2022-11-29T03:31:08.798+00:00',
        //     price_lovelace: 90000000,
        //     listing_type: 'SINGLE_ASSET' | 'BUNDLE'
        //   }
        // ]

        // sold = true
        // [
        //   {
        //     asset_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7833343934',
        //     display_name: 'Bad Fox #3494',
        //     tx_hash: '8701d3b1395dbb353185f98f663751d99cff1d4ef81e79b27cb0c4ca52bf934f',
        //     listing_id: null,
        //     confirmed_at: null,
        //     price_lovelace: 125000000,
        //     listing_type: 'SINGLE_ASSET' | 'BUNDLE'
        //   }
        // ]

        // BUNDLE
        // {
        //     ...
        //     bundled_assets": [
        //         {
        //           "asset_id": "fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7834313536",
        //           "display_name": "Bad Fox #4156"
        //         },
        //         {
        //           "asset_id": "fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7834303130",
        //           "display_name": "Bad Fox #4010"
        //         },
        //         {
        //           "asset_id": "fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7832323432",
        //           "display_name": "Bad Fox #2242"
        //         },
        //         {
        //           "asset_id": "fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7834373031",
        //           "display_name": "Bad Fox #4701"
        //         }
        //     ]
        // }
      } catch (e) {
        return reject(e)
      }
    })
  }

  getListings = (options = {}) => {
    const maxSize = 100
    const policyId = options.policyId ?? BAD_FOX_POLICY_ID
    const uri = `${this.baseUrl}/search/tokens?policyIds=["${policyId}"]&saleType=buy-now&sortBy=price-low-to-high&verified=default`
    // &saleType=default

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching listings from jpg.store for policy ID ${policyId}`)

      try {
        const payload = []

        const { data } = await axios.get(`${uri}&size=${maxSize}`, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        data.tokens
          .filter((item) => item.listing_lovelace > 0)
          .map((item) => {
            const asset = getFileForPolicyId(policyId, 'assets').find((asset) => asset.assetId === item.asset_id)

            return {
              assetId: item.asset_id,
              name: item.display_name,
              price: Number(item.listing_lovelace) / ONE_MILLION,
              rank: asset.rarityRank,
              attributes: asset.attributes,
              imageUrl: formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank),
              itemUrl: `https://jpg.store/asset/${item.asset_id}`,
              date: new Date(item.listed_at),
            }
          })

        console.log(`Fetched ${payload.length} listings from jpg.store`)

        return resolve(payload)
        // [
        //   {
        //     asset_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7833373639',
        //     policy_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967',
        //     display_name: 'Bad Fox #3769',
        //     traits: {
        //       traitcount: '9',
        //       'attributes / Ear': '(u) none',
        //       'attributes / Back': '(u) none',
        //       'attributes / Skin': '(f) vanilla',
        //       'attributes / Mouth': '(f) octopus',
        //       'attributes / Gender': 'female',
        //       'attributes / Clothes': '(f) black dress',
        //       'attributes / Eyewear': '(u) none',
        //       'attributes / Headwear': '(u) jason mask',
        //       'attributes / Background': '(u) plain reflected'
        //     },
        //     asset_num: 3769,
        //     media_type: null,
        //     likes: '0',
        //     reports: '0',
        //     quantity: 1,
        //     created_at: '2022-07-15T16:22:07.439924+00:00',
        //     fingerprint: 'asset1qr0afgavewh7f0hrcrmu536j2c4c3jg7ny2wcl',
        //     asset_name: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7833373639',
        //     initial_mint_tx_hash: '5506929',
        //     is_taken_down: false,
        //     source: 'QmX2q9kAuZrt5d8hVjUshnU6xZ94kKhzuFf2fsZj2RGy61',
        //     optimized_source: 'QmX2q9kAuZrt5d8hVjUshnU6xZ94kKhzuFf2fsZj2RGy61',
        //     collections: {
        //       _index: 'collections',
        //       _id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967',
        //       policy_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967',
        //       display_name: 'Bad Fox Motorcycle Club - Fox Collection',
        //       description: 'The Fox Collection includes 6,000 NFTs, half of which are female and half male - all fox holders are rewarded 80% from royalties.',
        //       url: 'badfoxmotorcycleclub-foxcollection',
        //       is_verified: true,
        //       optimized_source: '65fe0f62-0dbc-414f-8a3b-68b72fe5ca5d',
        //       source: '65fe0f62-0dbc-414f-8a3b-68b72fe5ca5d',
        //       global_volume_lovelace_all_time: 28909000000,
        //       jpg_floor_lovelace: 50000000,
        //       jpg_volume_lovelace_24h: 33215160000,
        //       created_at: '2022-06-29T14:11:28.984000+00:00',
        //       global_floor_lovelace: 51000000,
        //       is_minting: true,
        //       is_taken_down: false,
        //       likes: null,
        //       reports: null,
        //       nsfw: false,
        //       state_of_project: 'ACTIVE',
        //       supply: 1927
        //     },
        //     listed_at: '2022-07-15T17:50:03.768Z',
        //     has_pending_transaction: false,
        //     listing_lovelace: '65000000',
        //     views: '0'
        //   }
        // ]
      } catch (e) {
        return reject(e)
      }
    })
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
        // {
        //   count: 2,
        //   txs: [
        //     {
        //       action: 'BUY',
        //       tx_hash: '29486423c7a8d2ece5303be3ffb504bfc6f37e0a312146797568daaea954c840',
        //       seller_address:
        //         'addr1qx60vuyqv2v9s4awht5j87pay0r4en4pulgxgntp6uvd84are4kugkwh2cqx2hn7gqna5nels93tlh6r6zmf0xucdjkqzt8tfv',
        //       signer_address:
        //         'addr1q9rqqcwlfnt07l7064vrrkgzvxjea0cfrkv48vqsx4qektcxa5ln8dq3l2wj597622s2qwqy88jry3xh9xqy2ka7cqgs67tgvu',
        //       created_at: '2022-07-21T20:53:17.347+00:00',
        //       amount_lovelace: 180000000,
        //     },
        //     {
        //       action: 'SELL',
        //       tx_hash: 'd1ef4e3b6296cd84e47f1e2758e0833d9f05987e50c375b2476506e3eaed7828',
        //       seller_address:
        //         'addr1qx60vuyqv2v9s4awht5j87pay0r4en4pulgxgntp6uvd84are4kugkwh2cqx2hn7gqna5nels93tlh6r6zmf0xucdjkqzt8tfv',
        //       signer_address:
        //         'addr1qx60vuyqv2v9s4awht5j87pay0r4en4pulgxgntp6uvd84are4kugkwh2cqx2hn7gqna5nels93tlh6r6zmf0xucdjkqzt8tfv',
        //       created_at: '2022-07-20T01:16:56.263+00:00',
        //       amount_lovelace: 180000000,
        //     },
        //   ],
        // }
      } catch (e) {
        return reject(e)
      }
    })
  }
}

const jpgStore = new JpgStore()

export default jpgStore
