import { NextApiRequest, NextApiResponse } from 'next'
import { PolicyId, PopulatedAsset } from '../../../../@types'
import populateAsset from '../../../../functions/populateAsset'

interface Response extends PopulatedAsset {}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query } = req

  const assetId = query.asset_id

  if (!assetId || typeof assetId !== 'string') {
    return res.status(400).end('Bad Request')
  }

  const policyId = query.policyId as PolicyId

  if (!policyId) {
    return res.status(400).end('Bad Request')
  }

  const withRanks = !!query.withRanks && query.withRanks != 'false' && query.withRanks != '0'

  try {
    switch (method) {
      case 'GET': {
        const populatedAsset = await populateAsset({
          assetId,
          policyId,
          withRanks,
        })

        return res.status(200).json(populatedAsset)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
