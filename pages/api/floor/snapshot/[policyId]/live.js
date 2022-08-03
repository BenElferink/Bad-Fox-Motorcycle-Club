import connectDB from '../../../../../utils/mongo'
import POLICY_IDS from '../../../../../constants/policy-ids'
import getFoxFloorV2 from '../../../../../functions/markets/getFoxFloorV2'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { policyId },
    } = req

    if (!policyId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query params required: policyId',
      })
    }

    if (!Object.values(POLICY_IDS).includes(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        const attributes = await getFoxFloorV2()

        return res.status(200).json({
          policyId,
          timestamp: 'LIVE',
          attributes,
        })
      }

      default: {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'Method does not exist for this route',
        })
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
