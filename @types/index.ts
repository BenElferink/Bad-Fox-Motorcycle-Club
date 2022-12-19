import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'

export type PolicyId = typeof BAD_FOX_POLICY_ID | typeof BAD_MOTORCYCLE_POLICY_ID

export interface OwningWallet {
  isContract: boolean
  stakeKey: string
  walletAddress: string
  assets: Record<
    PolicyId,
    {
      unit: string
      quantity: string
    }[]
  >
}

export interface PopulatedAsset {
  assetId: string
  fingerprint: string
  isBurned: boolean
  onChainName: string
  displayName: string
  serialNumber: number
  rarityRank: number
  price?: number
  attributes: {
    [category: string]: string
  }
  image: {
    ipfs: string
    firebase: string
  }
  files: []
}

export interface PopulatedWallet {
  stakeKey: string
  walletAddress: string
  assets: Record<PolicyId, PopulatedAsset[]>
  ownsAssets: boolean
}

export interface PopulatedTrait {
  onChainName: string
  displayName: string
  model: string
  image: string
  count: number
  percent: string
}

export type TraitsFile = Record<string, PopulatedTrait[]>

export interface JpgListedItem {
  assetId: string
  name: string
  price: number
  itemUrl: string
  date: Date
}

export interface JpgRecentItem extends JpgListedItem {
  type: 'sale' | 'listing'
  imageUrl: string
  rank: number
  attributes: Record<string, string>
}

export interface FloorPrices {
  [category: string]: {
    [trait: string]: number
  }
}

export interface FloorSnapshot {
  timestamp: number
  policyId: PolicyId
  attributes: FloorPrices
}
