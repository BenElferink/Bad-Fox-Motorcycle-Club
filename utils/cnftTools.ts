import axios from 'axios'

export interface RankedPolicyAsset {
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

class CnftTools {
  baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.cnft.tools'
  }

  getPolicyAssets = (policyId: string): Promise<RankedPolicyAsset[]> => {
    const uri = `${this.baseUrl}/api/external/${policyId}`

    return new Promise(async (resolve, reject) => {
      console.log(`Fetching from cnft.tools for policy ID ${policyId}`)

      try {
        const { data } = await axios.get<RankedPolicyAsset[]>(uri, {
          headers: {
            'Accept-Encoding': 'application/json',
          },
        })

        const payload = data.sort((a, b) => Number(a.assetID) - Number(b.assetID))

        console.log(`Fetched ${payload.length} items from jpg.store`)

        return resolve(data)
      } catch (e) {
        return reject(e)
      }
    })
  }
}

const cnftTools = new CnftTools()

export default cnftTools
