import { NextApiRequest, NextApiResponse } from 'next'
import fromHex from '../../../../functions/formatters/hex/fromHex'
import blockfrost from '../../../../utils/blockfrost'

export interface FetchedAssetResponse {
  asset: string
  policy_id: string
  asset_name: string | null
  fingerprint: string
  quantity: string
  initial_mint_tx_hash: string
  mint_or_burn_count: number
  onchain_metadata:
    | ({
        name?: string
        image?: string | string[]
      } & {
        [key: string]: unknown
      })
    | null
  metadata: {
    name: string
    description: string
    ticker: string | null
    url: string | null
    logo: string | null
    decimals: number | null
  } | null
}

const handler = async (req: NextApiRequest, res: NextApiResponse<FetchedAssetResponse>) => {
  const { method, query } = req

  const assetId = query.asset_id

  try {
    switch (method) {
      case 'GET': {
        if (!assetId || typeof assetId !== 'string') {
          return res.status(400).end('Bad Request')
        }

        console.log('Fetching asset with asset ID:', assetId)

        const data = await blockfrost.api.assetsById(assetId)

        console.log('Fetched asset:', data)

        // @ts-ignore
        if (data.onchain_metadata_standard === 'CIP68v1') {
          Object.entries(data.onchain_metadata || {}).forEach(([key, val]) => {
            if (!['name', 'description', 'image', 'mediaType', 'files'].includes(key)) {
              // @ts-ignore
              data.onchain_metadata[key] = fromHex(val as string).slice(1)
            }
          })

          console.log('Translated CIP-68 metadata:', data.onchain_metadata)
        }

        return res.status(200).json(data)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error)

    return res.status(500).end('Internal Server Error')
  }
}

export default handler
