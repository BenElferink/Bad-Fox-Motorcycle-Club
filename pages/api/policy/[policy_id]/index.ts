import { NextApiRequest, NextApiResponse } from 'next'
import blockfrost from '../../../../utils/blockfrost'

export type PolicyAssetsResponse = {
  asset: string
  quantity: string
}[]

const handler = async (req: NextApiRequest, res: NextApiResponse<PolicyAssetsResponse>) => {
  const { method, query } = req

  const policyId = query.policy_id
  const allAssets = !!query.allAssets && query.allAssets != 'false' && query.allAssets != '0'

  try {
    switch (method) {
      case 'GET': {
        if (!policyId || typeof policyId !== 'string') {
          return res.status(400).end('Bad Request')
        }

        console.log('Fetching assets with policy ID:', policyId)

        const data = allAssets
          ? await blockfrost.api.assetsPolicyByIdAll(policyId)
          : await blockfrost.api.assetsPolicyById(policyId)

        console.log('Fetched assets:', data)

        return res.status(200).json(data)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error)

    // @ts-ignore
    if (error?.status_code === 400 || error?.message === 'Invalid or malformed policy format.') {
      return res.status(400).end('Invalid or malformed Policy ID')
    }

    return res.status(500).end('Internal Server Error')
  }
}

export default handler
