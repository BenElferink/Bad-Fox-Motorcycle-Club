import { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '../../../../utils/firebase'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'
import getFloorPrices from '../../../../functions/getFloorPrices'
import type { FloorPrices, PolicyId } from '../../../../@types'

export interface FloorResponse {
  count: number
  items: {
    policyId: string
    timestamp: number
    floor: number
    attributes: FloorPrices
  }[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<FloorResponse>) => {
  const { method, query } = req

  const policyId = query.policy_id as PolicyId

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).end(`This Policy ID is not allowed: ${policyId}`)
  }

  const live = !!query.live && query.live != 'false' && query.live != '0'
  const limit = (() => {
    const min = 1
    const max = 30
    const num = Number(query.limit)

    return isNaN(num) ? max : num >= min && num <= max ? num : max
  })()

  try {
    switch (method) {
      case 'GET': {
        if (live) {
          const timestamp = Date.now()
          const liveFloorPrices = await getFloorPrices(policyId)

          return res.status(200).json({
            count: 1,
            items: [
              {
                policyId,
                timestamp,
                floor: liveFloorPrices.baseFloor,
                attributes: liveFloorPrices.attributesFloor,
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
          // .limit(limit * projects.length)
          .get()

        const docs = docsQuery.docs
          .map((doc) => doc.data())
          .filter((doc) => doc.policyId === policyId) as FloorResponse['items']

        while (docs.length > limit) {
          docs.shift()
        }

        return res.status(200).json({
          count: docs.length,
          items: docs,
        })
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
