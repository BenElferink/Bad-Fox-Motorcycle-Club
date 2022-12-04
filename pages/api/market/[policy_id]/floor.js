import { firestore } from '../../../../utils/firebase'
import jpgStore from '../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'
import { ADMIN_CODE } from '../../../../constants'
import projects from '../../../../data/projects.json'

export default async (req, res) => {
  const { method, headers, query } = req

  const adminCode = headers.admin_code
  const policyId = query.policy_id
  const live = !!query.live
  const limit = Number(query.limit || 30)

  if (!policyId) {
    return res.status(400).json({
      type: 'BAD_REQUEST',
      message: 'Query params required (policyId: string)',
    })
  }

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).json({
      type: 'BAD_REQUEST',
      message: `This policy ID is not allowed: ${policyId}`,
    })
  }

  try {
    switch (method) {
      case 'GET': {
        if (live) {
          const timestamp = Date.now()
          const liveFloorPrices = await jpgStore.getFloorPrices(policyId)

          return res.status(200).json({
            count: 1,
            items: [
              {
                policyId,
                timestamp,
                attributes: liveFloorPrices,
              },
            ],
          })
        }

        if (!limit || isNaN(limit)) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Query params required (limit: number)',
          })
        }

        const docsQuery = await firestore
          .collection('floor-snapshots')
          .orderBy('timestamp', 'asc')
          .limit(limit * projects.length)
          .get()

        const docs = docsQuery.docs.map((doc) => doc.data()).filter((doc) => doc.policyId === policyId)

        while (docs.length > limit) {
          docs.shift()
        }

        return res.status(200).json({
          count: docs.length,
          items: docs,
        })
      }

      case 'HEAD': {
        if (adminCode !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        const timestamp = Date.now()
        const liveFloorPrices = await jpgStore.getFloorPrices(policyId)

        const collection = firestore.collection('floor-snapshots')
        await collection.add({
          policyId,
          timestamp,
          attributes: liveFloorPrices,
        })

        return res.status(204).end()
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'HEAD')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({})
  }
}
