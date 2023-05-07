import { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '../../../../utils/firebase'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'
import getFloorPrices from '../../../../functions/getFloorPrices'
import type { PolicyId } from '../../../../@types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req

  const policyId = query.policy_id as PolicyId

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).end(`This Policy ID is not allowed: ${policyId}`)
  }

  try {
    const timestamp = Date.now()
    const liveFloorPrices = await getFloorPrices(policyId)

    const collection = firestore.collection('floor-snapshots')
    await collection.add({
      policyId,
      timestamp,
      floor: liveFloorPrices.baseFloor,
      attributes: liveFloorPrices.attributesFloor,
    })

    return res.status(204).end()
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
