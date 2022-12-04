import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'

export interface PopulatedWallet {
  stakeKey: string
  walletAddress: string
  assets: {
    [BAD_FOX_POLICY_ID]: PopulatedAsset[]
    [BAD_MOTORCYCLE_POLICY_ID]: PopulatedAsset[]
  }
  ownsAssets: boolean
}

export interface PopulatedAsset {
  assetId: string
  fingerprint: string
  isBurned: boolean
  onChainName: string
  displayName: string
  serialNumber: number
  rarityRank: number
  attributes: {
    [category: string]: string
  }
  image: {
    ipfs: string
    firebase: string
  }
  files: []
}

export interface PopulatedTrait {
  onChainName: string
  displayName: string
  model: string
  image: string
  count: number
  percent: string
}

export interface JpgListedItem {
  assetId: string
  name: string
  price: number
  itemUrl: string
  date: Date
}

export interface JpgRecentItem extends JpgListedItem {
  rank: number
  attributes: Record<string, string>
  imageUrl: string
}
