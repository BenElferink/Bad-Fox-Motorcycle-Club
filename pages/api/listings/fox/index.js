import fetchJpgListedItems from '../../../../functions/markets/fetchJpgListedItems'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const { method, query } = req

    switch (method) {
      case 'GET': {
        const size = (() => {
          const max = 6000
          const num = Number(query.size)

          return isNaN(num) ? max : num <= max ? num : max
        })()

        const data = await fetchJpgListedItems({ policyId: FOX_POLICY_ID, size })

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
