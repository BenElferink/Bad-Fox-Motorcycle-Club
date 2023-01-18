import axios from 'axios'

interface FetchedRankedAsset {
  onSale: boolean
  assetID: string // '1'
  assetName: string // 'on-chain name'
  name: string // 'display name'
  encodedName: string // 'hex'
  iconurl: string // 'ips:// --> only the reference, no prefix'
  rarityRank: string // '1'
  ownerStakeKey: string // 'stake1...'

  [lowercasedTraitCategory: string]: any // eyewear: '(U) 3D Glasses'
}

export interface FormattedRankedAsset {
  assetId: string
  rank: number
}

class CnftTools {
  baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.cnft.tools'
  }

  getRankedAssets = (policyId: string): Promise<FormattedRankedAsset[]> => {
    const uri = `${this.baseUrl}/api/external/${policyId}`

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching from cnft.tools for policy ID ${policyId}`)

      try {
        const { data } = await axios.get<FetchedRankedAsset[]>(uri, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        const payload = data
          .map((item) => ({
            assetId: `${policyId}${item.encodedName}`,
            rank: Number(item.rarityRank),
          }))
          .sort((a, b) => a.rank - b.rank)

        const payloadLength = payload.length

        console.log(`Fetched ${payloadLength} items from cnft.tools`)

        return resolve(payload)
      } catch (error: any) {
        if (error?.response?.data?.error === 'Policy ID not found') {
          return resolve([])
        }

        return reject(error)
      }
    })
  }
}

export default CnftTools
