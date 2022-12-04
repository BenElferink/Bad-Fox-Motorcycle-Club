import blockfrost from '../../../utils/blockfrost'

export default async (req, res) => {
  try {
    const {
      method,
      query: { policyId },
    } = req

    switch (method) {
      case 'GET': {
        if (!policyId) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'One of query params required: policyId',
          })
        }

        const assetIds = policyId ? await blockfrost.getAssetIdsWithPolicyId(policyId) : []

        return res.status(201).json({
          count: assetIds.length,
          assetIds,
        })
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
