import jpgStore from '../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'

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

    if (!isPolicyIdAllowed(policyId)) {
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

        const data = await jpgStore.getRecents({ policyId, sold: s, page: p })

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
