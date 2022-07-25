import fetchJpgRecentItems from '../../../../functions/markets/fetchJpgRecentItems'
import POLICY_IDS from '../../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const {
      method,
      query: { policyId, page, sold },
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
        const s = sold == 'true'
        const p = (() => {
          const min = 1
          const num = Number(page)

          return isNaN(num) ? min : num >= min ? num : min
        })()

        const data = await fetchJpgRecentItems({ policyId, sold: s, page: p })

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
