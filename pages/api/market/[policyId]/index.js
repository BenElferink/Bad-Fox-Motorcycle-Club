import { jpgStore } from '../../../../utils/jpgStore'
import POLICY_IDS from '../../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const {
      method,
      query: { policyId, size },
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
        const s = (() => {
          const max = 6000
          const num = Number(size)

          return isNaN(num) ? max : num <= max ? num : max
        })()

        const data = await jpgStore.getListings({ policyId, size: s })

        return res.status(200).json(data)
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
