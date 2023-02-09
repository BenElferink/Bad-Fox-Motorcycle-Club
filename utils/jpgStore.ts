import axios from 'axios'
import getFileForPolicyId from '../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../functions/formatters/formatIpfsImageUrl'
import populateAsset from '../functions/populateAsset'
import { FloorPrices, PolicyId, PopulatedAsset, TraitsFile } from '../@types'
import { BAD_KEY_POLICY_ID, ONE_MILLION } from '../constants'

interface FetchedListingOrSale {
  asset_id: string
  display_name: string
  tx_hash: string
  listing_id: number | null
  listed_at?: string
  confirmed_at?: string
  price_lovelace: string
  listing_type: 'SINGLE_ASSET' | 'BUNDLE'
}

interface FetchedAssetHistory {
  action: 'BUY' | 'SELL' | 'DELIST' | 'UPDATE'
  tx_hash: string
  seller_address: string
  signer_address: string
  confirmed_at: string
  amount_lovelace: string
  bundled_assets_count: string
}

export interface FormattedListingOrSale {
  assetId: string
  name: string
  price: number
  imageUrl: string
  itemUrl: string
  date: Date
  type: 'sale' | 'listing'
}

class JpgStore {
  baseUrl: string

  constructor() {
    this.baseUrl = 'https://server.jpgstoreapis.com'
  }

  private formatListingOrSale = async (
    type: 'listing' | 'sale',
    policyId: PolicyId,
    items: FetchedListingOrSale[]
  ): Promise<FormattedListingOrSale[]> => {
    const policyAssets = getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]

    return await Promise.all(
      items.map(async (item) => {
        let asset = policyAssets.find((asset) => asset.assetId === item.asset_id)

        if (!asset) {
          asset = await populateAsset({
            policyId,
            assetId: item.asset_id,
            withRanks: policyId !== BAD_KEY_POLICY_ID,
          })
        }

        return {
          assetId: item.asset_id,
          name: item.display_name,
          price: Number(item.price_lovelace) / ONE_MILLION,
          imageUrl: formatIpfsImageUrl({
            ipfsUri: asset?.image.ipfs || '',
            hasRank: !!asset?.rarityRank,
          }),
          itemUrl: `https://jpg.store/asset/${item.asset_id}`,
          // @ts-ignore
          date: new Date(type === 'sale' ? item?.confirmed_at : item?.listed_at),
          type,
        }
      })
    )
  }

  getRecents = (options: {
    policyId: PolicyId
    sold?: boolean
    page?: number
  }): Promise<FormattedListingOrSale[]> => {
    const policyId = options.policyId ?? ''
    const sold = options.sold ?? false
    const type = sold ? 'sales' : 'listings'
    const page = options.page ?? 0
    const uri = `${this.baseUrl}/policy/${policyId}/${type}${sold ? `?page=${page || 1}` : ''}`

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching recent ${type} from jpg.store at page ${page} for policy ID ${policyId}`)

      try {
        const { data } = await axios.get<FetchedListingOrSale[]>(uri, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        const payload = (
          await this.formatListingOrSale(
            type.substring(0, type.length - 1) as 'sale' | 'listing',
            policyId,
            // @ts-ignore ( data.listings = only for /listings )
            !sold ? data?.listings : data
          )
        ).sort((a, b) => a.date.getTime() - b.date.getTime())

        if (!sold) {
          console.log(payload)
          console.log(uri)
          console.log(options)
        }

        console.log(`Fetched ${payload.length} items from jpg.store`)

        return resolve(payload)
      } catch (e) {
        return reject(e)
      }
    })
  }

  getListings = (policyId: PolicyId): Promise<FormattedListingOrSale[]> => {
    const uri = `${this.baseUrl}/policy/${policyId}/listings`

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching listings from jpg.store for policy ID ${policyId}`)
      try {
        let cursor = null
        let fetchedItems: FetchedListingOrSale[] = []

        for (let i = 0; true; i++) {
          if (!cursor && i > 0) break

          // @ts-ignore
          const { data } = await axios.get<{
            nextPageCursor: string | null
            listings: FetchedListingOrSale[]
          }>(uri + (cursor ? `?cursor=${cursor}` : ''), {
            headers: {
              'Accept-Encoding': 'application/json',
            },
          })

          cursor = data.nextPageCursor

          if (!data.listings.length) break
          fetchedItems = fetchedItems.concat(data.listings)
        }

        const payload = (await this.formatListingOrSale('listing', policyId, fetchedItems)).sort(
          (a, b) => a.price - b.price
        )

        console.log(`Fetched ${payload.length} listings from jpg.store`)

        return resolve(payload)
      } catch (e) {
        return reject(e)
      }
    })
  }

  getFloorPrices = async (
    policyId: PolicyId
  ): Promise<{
    baseFloor: number
    attributesFloor: FloorPrices
  }> => {
    const floorData: FloorPrices = {}
    const traitsData: Record<string, string[]> = {}

    const policyAssets = getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]
    const policyTraits = getFileForPolicyId(policyId, 'traits') as TraitsFile

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
          // Lisitng sare already sorted by price, cheapest 1st
          const asset = policyAssets.find((asset) => asset.assetId === assetId)

          if (asset?.attributes[category] === trait) {
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

    return {
      baseFloor: listings[0]?.price || 0,
      attributesFloor: floorData,
    }
  }

  getAssetPurchasePrice = (
    assetId: string,
    walletAddress?: string
  ): Promise<{
    price: number
    timestamp: number
  }> => {
    const uri = `${this.baseUrl}/token/${assetId}/tx-history?limit=50&offset=0`

    return new Promise(async (resolve, reject) => {
      console.log(
        `Fetching tx history from jpg.store for asset ID ${assetId}${
          walletAddress ? ` strictly for signing wallet address ${walletAddress}` : ''
        }`
      )

      try {
        const { data } = await axios.get<{
          count: number
          txs: FetchedAssetHistory[]
        }>(uri, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        console.log(data)

        let boughtAtPrice = 0
        let boughtAtTimestamp = 0

        for (let i = 0; i < data.txs.length; i++) {
          const tx = data.txs[i]

          if (tx.action === 'BUY' && (!walletAddress || walletAddress === tx.signer_address)) {
            boughtAtPrice = Number(tx.amount_lovelace) / ONE_MILLION
            boughtAtTimestamp = new Date(tx.confirmed_at).getTime()
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
