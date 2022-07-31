import connectDB from '../../../../utils/mongo'
import POLICY_IDS from '../../../../constants/policy-ids'
import getFoxFloor from '../../../../functions/markets/getFoxFloor'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { policyId, type },
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
        if (!type) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Query params required: type',
          })
        }

        const foundFloors = []

        ;(await getFoxFloor()).forEach((obj) => {
          const liveType = obj.type.toLowerCase()

          if (liveType === type.toLowerCase()) {
            foundFloors.push({
              policyId,
              type: liveType,
              price: obj.price,
              timestamp: 'LIVE',
            })
          }
        })

        return res.status(200).json({
          floors: foundFloors,
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
