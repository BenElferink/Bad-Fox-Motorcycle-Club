import connectDB from '../../../utils/mongo'
import Floor from '../../../models/Floor'
import POLICY_IDS from '../../../constants/policy-ids'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId, type: typeFromQuery = '' },
      body: { type: typeFromBody = '', price = 0, timestamp = 0 },
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
        if (!typeFromQuery) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Query params required: type',
          })
        }

        const filters = {
          policyId,
          type: typeFromQuery.toLowerCase(),
        }

        const count = await Floor.countDocuments(filters)
        const foundFloors = await Floor.find(filters)

        return res.status(200).json({
          count,
          floors: foundFloors,
        })
      }

      case 'POST': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        if (!typeFromBody || (!price && price !== null) || !timestamp) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Body params required: type, price, timestamp',
          })
        }

        const newFloor = new Floor({
          policyId,
          type: typeFromBody.toLowerCase(),
          price,
          timestamp,
        })

        await newFloor.save()

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
