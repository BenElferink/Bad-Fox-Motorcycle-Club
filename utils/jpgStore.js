const axios = require('axios')
const foxAssetsFile = require('../data/assets/fox')
const { JPG_API } = require('../constants/api-urls')
const { BAD_FOX_POLICY_ID } = require('../constants/policy-ids')

class JpgStore {
  constructor() {}

  getRecents = (options = {}) => {
    const policyId = options.policyId ?? BAD_FOX_POLICY_ID
    const sold = options.sold ?? false
    const page = options.page ?? 1
    const uri = `${JPG_API}/policy/${policyId}/${sold ? 'sales' : 'listings'}?page=${page}`

    return new Promise(async (resolve, reject) => {
      console.log(
        `Fetching recent ${sold ? 'sales' : 'listings'} from jpg.store at page ${page} for policy ID ${policyId}`
      )

      try {
        const { data } = await axios.get(uri)

        const payload = data.map((item) => {
          const asset = foxAssetsFile.assets.find((asset) => asset.assetId === item.asset_id)

          return {
            assetId: item.asset_id,
            name: item.display_name,
            price: Number(item.price_lovelace) / 1000000,
            rank: asset.rarityRank,
            attributes: asset.attributes,
            imageUrl: asset.image.cnftTools,
            itemUrl: `https://jpg.store/asset/${item.asset_id}`,
            date: new Date(sold ? item.confirmed_at : item.listed_at),
          }
        })

        console.log(`Fetched ${payload.length} items from jpg.store`)

        return resolve(payload)
        // sold = false
        // [
        //   {
        //     asset_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7832363334',
        //     display_name: 'Bad Fox #2634',
        //     tx_hash: 'e23096dead242805a54451cd747720f2b46f376c047df4bc51f035878e411e33',
        //     listing_id: 20124090,
        //     listed_at: '2022-08-22T21:29:03.233+00:00',
        //     price_lovelace: 199000000
        //   }
        // ]

        // sold = true
        // [
        //   {
        //     asset_id: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7833393230',
        //     display_name: 'Bad Fox #3920',
        //     tx_hash: '17e5385746def6fde2bd1cfbb42b1a9925447ff8cb05bc5487d30d17df64cdd3',
        //     listing_id: 20156621,
        //     confirmed_at: '2022-08-22T16:41:02.965+00:00',
        //     price_lovelace: 34000000
        //   }
        // ]
      } catch (e) {
        return reject(e)
      }
    })
  }

  getListings = (options = {}) => {
    const policyId = options.policyId ?? BAD_FOX_POLICY_ID
    const size = options.size ?? 6000
    const uri = `${JPG_API}/search/tokens?policyIds=["${policyId}"]&saleType=buy-now&sortBy=price-low-to-high&verified=default&size=${size}`
    // &saleType=default

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching ${size} listings from jpg.store for policy ID ${policyId}`)

      try {
        const { data } = await axios.get(uri)

        const payload = data.tokens
          .filter((item) => item.listing_lovelace > 0)
          .map((item) => {
            const asset = foxAssetsFile.assets.find((asset) => asset.assetId === item.asset_id)

            return {
              assetId: item.asset_id,
              name: item.display_name,
              price: Number(item.listing_lovelace) / 1000000,
              rank: asset.rarityRank,
              attributes: asset.attributes,
              imageUrl: asset.image.cnftTools,
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
}

const jpgStore = new JpgStore()

module.exports = {
  JpgStore,
  jpgStore,
}
