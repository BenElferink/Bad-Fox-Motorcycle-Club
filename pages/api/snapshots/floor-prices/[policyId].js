import connectDB from '../../../../utils/mongo'
import FloorSnapshot from '../../../../models/FloorSnapshot'
import getFoxFloor from '../../../../functions/markets/getFoxFloor'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'
import { ADMIN_CODE } from '../../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId },
    } = req

    if (!policyId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query params required: policyId',
      })
    }

    if (!isPolicyIdAllowed(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        const dbSnapshots = await FloorSnapshot.find({ policyId }).sort({ timestamp: 1 })

        const liveFloorAttributes = await getFoxFloor()

        dbSnapshots.push({
          policyId,
          timestamp: 'LIVE',
          attributes: liveFloorAttributes,
        })

        return res.status(200).json({
          count: dbSnapshots.length,
          snapshots: dbSnapshots,
        })
      }

      case 'HEAD': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        const newDate = new Date()
        newDate.setHours(0)
        newDate.setMinutes(0)
        newDate.setSeconds(0)
        newDate.setMilliseconds(0)
        const timestamp = newDate.getTime()

        const floorAttributes = await getFoxFloor()

        const newSnapshot = new FloorSnapshot({
          policyId,
          timestamp,
          attributes: floorAttributes,
        })

        await newSnapshot.save()

        // delete all snapshots greater than 30 days old
        const dbSnapshots = await FloorSnapshot.find({ policyId }).sort({ timestamp: 1 })
        const toDelete = []

        while (dbSnapshots.length > 30) {
          toDelete.push(dbSnapshots.shift())
        }

        await Promise.all(toDelete.map((item) => FloorSnapshot.deleteOne({ _id: item._id })))

        return res.status(204).end()
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'HEAD')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
