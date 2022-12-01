import jpgStore from '../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'

export default async (req, res) => {
  try {
    const { method, query } = req

    const policyId = query.policy_id
    const sold = !!query.sold && query.sold != 'false' && query.sold != '0'
    const page = Number(query.page || 1)

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
        const p = (() => {
          const min = 1
          const num = Number(page)

          return isNaN(num) ? min : num >= min ? num : min
        })()

        const data = await jpgStore.getRecents({ policyId, sold, page: p })

        return res.status(200).json({
          count: data.length,
          items: data,
        })
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
