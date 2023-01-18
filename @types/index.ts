import { BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'

export type PolicyId = typeof BAD_FOX_POLICY_ID | typeof BAD_MOTORCYCLE_POLICY_ID | typeof BAD_KEY_POLICY_ID

export interface AssetIncludedFile {
  name: string
  mediaType: string
  src: string
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
  files: AssetIncludedFile[]
}

export interface PopulatedWallet {
  stakeKey: string
  walletAddress: string
  assets: Record<PolicyId, PopulatedAsset[]>
}

export type TraitsFile = Record<
  string,
  {
    onChainName: string
    displayName: string
    model: string
    image: string
    count: number
    percent: string
  }[]
>

export interface FloorPrices {
  [category: string]: {
    [trait: string]: number
  }
}

export interface FloorSnapshot {
  policyId: PolicyId
  timestamp: number
  floor: number
  attributes: FloorPrices
}
