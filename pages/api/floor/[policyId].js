import connectDB from '../../../utils/mongo'
import { ADMIN_CODE } from '../../../constants/api-keys'
import Floor from '../../../models/Floor'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { policyId, adminCode, type: queryType = '' },
      body: { type: bodyType = '', price = 0, timestamp = 0 },
    } = req

    if (!policyId) {
      return res.status(400).json({ type: 'BAD_REQUEST', message: 'Query params required: policyId' })
    }

    switch (method) {
      case 'GET': {
        if (!queryType) {
          return res.status(400).json({ type: 'BAD_REQUEST', message: 'Query params required: type' })
        }

        const foundFloors = await Floor.find({ policyId, type: queryType.toLowerCase() })

        res.status(200).json(foundFloors)
        break
      }

      case 'POST': {
        if (adminCode !== ADMIN_CODE) {
          return res.status(401).json({ type: 'UNAUTHORIZED', message: 'Admin code is invalid' })
        }

        if (!bodyType || !price || !timestamp) {
          return res
            .status(400)
            .json({ type: 'BAD_REQUEST', message: 'Body params required: type, price, timestamp' })
        }

        const newFloor = new Floor({ policyId, type: bodyType.toLowerCase(), price, timestamp })
        await newFloor.save()

        res.status(201).json(newFloor)
        break
      }

      default: {
        res.status(404).json({})
        break
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({})
  }
}
