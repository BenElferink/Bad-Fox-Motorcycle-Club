import { firebase, firestore } from '../../../../utils/firebase'
import jpgStore from '../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'
import { ADMIN_CODE } from '../../../../constants'
import { NextApiRequest, NextApiResponse } from 'next'
import projects from '../../../../data/projects.json'

interface Response {
  count: number
  items: firebase.firestore.DocumentData[]
}

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, headers, query } = req

  const policyId = query.policy_id as string
  const adminCode = headers.admin_code
  const live = !!query.live
  const limit = (() => {
    const min = 1
    const max = 30
    const num = Number(query.limit)

    return isNaN(num) ? max : num >= min && num <= max ? num : max
  })()

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).end(`This Policy ID is not allowed: ${policyId}`)
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
          return res.status(400).end('Query params required (limit: number)')
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
          return res.status(401).end()
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
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}
