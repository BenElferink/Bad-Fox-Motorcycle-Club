import connectDB from '../../../../../utils/mongo'
import FloorSnapshot from '../../../../../models/FloorSnapshot'
import POLICY_IDS from '../../../../../constants/policy-ids'
import { ADMIN_CODE } from '../../../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId },
      body: { timestamp = 0, attributes = {} },
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
        const filters = { policyId }
        const count = await FloorSnapshot.countDocuments(filters)
        const snapshots = await FloorSnapshot.find(filters).sort({ timestamp: 1 })

        return res.status(200).json({
          count,
          snapshots,
        })
      }

      case 'POST': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        const snapshot = new FloorSnapshot({
          policyId,
          timestamp,
          attributes,
        })

        await snapshot.save()

        return res.status(204).end()
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
