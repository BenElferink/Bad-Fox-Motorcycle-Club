import fetchJpgRecentItems from '../../../../functions/markets/fetchJpgRecentItems'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const { method, query } = req

    switch (method) {
      case 'GET': {
        const sold = query.sold == 'true'
        const page = (() => {
          const min = 1
          const num = Number(query.page)

          return isNaN(num) ? min : num >= min ? num : min
        })()

        const data = await fetchJpgRecentItems({ policyId: FOX_POLICY_ID, sold, page })

        res.status(200).json(data)
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
