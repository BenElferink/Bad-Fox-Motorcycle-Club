import axios from 'axios'

type PolicyId = string
type TokenId = string
type PoolId = string
type TransactionId = string
type StakeKey = string

type Marketplace = 'jpg.store'
type ActivityType = 'LIST' | 'DELIST' | 'BUY' | 'SELL' | 'UPDATE'
type ListingType = 'SINGLE' | 'BUNDLE' | 'UNKNOWN'

interface Address {
  address: string
  isScript: boolean
}

export interface BadLabsApiBaseToken {
  tokenId: TokenId
  isFungible: boolean
  tokenAmount: {
    onChain: number
    decimals: number
    display: number
  }
  tokenName?: {
    onChain: string
    ticker: string
    display: string
  }
}

export interface BadLabsApiMarketToken {
  tokenId: string
  signingAddress?: string
  price: number
  date: Date
  marketplace: Marketplace
  activityType: ActivityType
  listingType: ListingType
  bundledTokens?: string[]
}

export interface BadLabsApiRankedToken extends BadLabsApiBaseToken {
  rarityRank?: number
}

export interface BadLabsApiWallet {
  stakeKey: StakeKey
  addresses: Address[]
  poolId?: PoolId
  tokens?: BadLabsApiBaseToken[]
}

export interface BadLabsApiPolicy {
  policyId: PolicyId
  tokens: BadLabsApiBaseToken[] | BadLabsApiRankedToken[]
}

export interface BadLabsApiPopulatedToken extends BadLabsApiRankedToken {
  fingerprint: string
  policyId: PolicyId
  serialNumber?: number
  mintTransactionId: string
  mintBlockHeight?: number
  image: {
    ipfs: string
    url: string
  }
  files: {
    src: string
    mediaType: string
    name: string
  }[]
  attributes: {
    [key: string]: any
  }
}

export interface BadLabsApiMarket {
  tokenId: string
  items: BadLabsApiMarketToken[]
}

export interface BadLabsApiTokenOwners {
  tokenId: string
  page: number
  owners: {
    quantity: number
    stakeKey: string
    addresses: Address[]
  }[]
}

export interface BadLabsApiPool {
  poolId: PoolId
  ticker: string
  delegators?: StakeKey[]
}

export interface BadLabsApiUtxo {
  address: {
    from: string
    to: string
  }
  tokens: {
    tokenId: string
    tokenAmount: {
      onChain: number
    }
  }[]
}

export interface BadLabsApiTransaction {
  transactionId: TransactionId
  block: string
  blockHeight: number
  utxos?: BadLabsApiUtxo[]
}

class BadLabsApi {
  baseUrl: string

  constructor() {
    this.baseUrl = 'https://labs.badfoxmc.com/api/cardano'
  }

  private getQueryStringFromQueryOptions = (options: Record<string, any> = {}): string => {
    const query = Object.entries(options)
      .filter(([key, val]) => key && val)
      .map(([key, cal]) => `&${key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)}=${cal}`)
      .join('')

    return query ? `?${query.slice(1)}` : ''
  }

  private handleError = async (error: any, reject: (reason: string) => void, retry: () => Promise<any>): Promise<any> => {
    console.error(error)

    if ([400, 404, 500, 504].includes(error?.response?.status)) {
      return reject(error?.response?.data || error?.message || 'UNKNOWN ERROR')
    } else {
      return await retry()
    }
  }

  wallet = {
    getData: (
      walletId: string,
      queryOptions?: {
        withStakePool?: boolean
        withTokens?: boolean
      }
    ): Promise<BadLabsApiWallet> => {
      const uri = `${this.baseUrl}/wallet/${walletId}` + this.getQueryStringFromQueryOptions(queryOptions)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching wallet:', walletId)

          const { data } = await axios.get<BadLabsApiWallet>(uri)

          console.log('Fetched wallet:', data.stakeKey)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.wallet.getData(walletId, queryOptions))
        }
      })
    },
  }

  policy = {
    getData: (
      policyId: string,
      queryOptions?: {
        allTokens?: boolean
        withBurned?: boolean
        withRanks?: boolean
      }
    ): Promise<BadLabsApiPolicy> => {
      const uri = `${this.baseUrl}/policy/${policyId}` + this.getQueryStringFromQueryOptions(queryOptions)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching policy tokens:', policyId)

          const { data } = await axios.get<BadLabsApiPolicy>(uri)

          console.log('Fetched policy tokens:', data.tokens.length)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.policy.getData(policyId, queryOptions))
        }
      })
    },

    market: {
      getData: (policyId: string): Promise<BadLabsApiMarket> => {
        const uri = `${this.baseUrl}/policy/${policyId}/market`

        return new Promise(async (resolve, reject) => {
          try {
            console.log('Fetching policy market data:', policyId)

            const { data } = await axios.get<BadLabsApiMarket>(uri)

            console.log('Fetched policy market data:', data.items.length)

            return resolve(data)
          } catch (error: any) {
            return await this.handleError(error, reject, async () => await this.policy.market.getData(policyId))
          }
        })
      },
      getActivity: (policyId: string): Promise<BadLabsApiMarket> => {
        const uri = `${this.baseUrl}/policy/${policyId}/market/activity`

        return new Promise(async (resolve, reject) => {
          try {
            console.log('Fetching policy market activity:', policyId)

            const { data } = await axios.get<BadLabsApiMarket>(uri)

            console.log('Fetched policy market activity:', data.items.length)

            return resolve(data)
          } catch (error: any) {
            return await this.handleError(error, reject, async () => await this.policy.market.getActivity(policyId))
          }
        })
      },
    },
  }

  token = {
    getData: (
      tokenId: string,
      queryOptions?: {
        populateMintTx?: boolean
      }
    ): Promise<BadLabsApiPopulatedToken> => {
      const uri = `${this.baseUrl}/token/${tokenId}` + this.getQueryStringFromQueryOptions(queryOptions)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching token:', tokenId)

          const { data } = await axios.get<BadLabsApiPopulatedToken>(uri)

          console.log('Fetched token:', data.fingerprint)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.token.getData(tokenId))
        }
      })
    },
    getOwners: (
      tokenId: string,
      queryOptions?: {
        page?: number
      }
    ): Promise<BadLabsApiTokenOwners> => {
      const uri = `${this.baseUrl}/token/${tokenId}/owners` + this.getQueryStringFromQueryOptions(queryOptions)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching token owners:', tokenId)

          const { data } = await axios.get<BadLabsApiTokenOwners>(uri)

          console.log('Fetched token owners:', data.owners.length)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.token.getOwners(tokenId, queryOptions))
        }
      })
    },

    market: {
      getData: (tokenId: string): Promise<BadLabsApiMarket> => {
        const uri = `${this.baseUrl}/token/${tokenId}/market`

        return new Promise(async (resolve, reject) => {
          try {
            console.log('Fetching token market data:', tokenId)

            const { data } = await axios.get<BadLabsApiMarket>(uri)

            console.log('Fetched token market data:', data.items.length)

            return resolve(data)
          } catch (error: any) {
            return await this.handleError(error, reject, async () => await this.token.market.getData(tokenId))
          }
        })
      },
      getActivity: (tokenId: string): Promise<BadLabsApiMarket> => {
        const uri = `${this.baseUrl}/token/${tokenId}/market/activity`

        return new Promise(async (resolve, reject) => {
          try {
            console.log('Fetching token market activity:', tokenId)

            const { data } = await axios.get<BadLabsApiMarket>(uri)

            console.log('Fetched token market activity:', data.items.length)

            return resolve(data)
          } catch (error: any) {
            return await this.handleError(error, reject, async () => await this.token.market.getActivity(tokenId))
          }
        })
      },
    },
  }

  stakePool = {
    getData: (
      poolId: string,
      queryOptions?: {
        withDelegators?: boolean
      }
    ): Promise<BadLabsApiPool> => {
      const uri = `${this.baseUrl}/pool/${poolId}` + this.getQueryStringFromQueryOptions(queryOptions)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching stake pool:', poolId)

          const { data } = await axios.get<BadLabsApiPool>(uri)

          console.log('Fetched stake pool:', data.ticker)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.stakePool.getData(poolId, queryOptions))
        }
      })
    },
  }

  transaction = {
    getData: (
      transactionId: string,
      queryOptions?: {
        withUtxos?: boolean
      }
    ): Promise<BadLabsApiTransaction> => {
      const uri = `${this.baseUrl}/transaction/${transactionId}` + this.getQueryStringFromQueryOptions(queryOptions)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching transaction:', transactionId)

          const { data } = await axios.get<BadLabsApiTransaction>(uri)

          console.log('Fetched transaction:', data.block)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.transaction.getData(transactionId))
        }
      })
    },
  }
}

const badLabsApi = new BadLabsApi()

export default badLabsApi
