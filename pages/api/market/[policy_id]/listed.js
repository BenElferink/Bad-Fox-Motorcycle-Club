import jpgStore from '../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../functions/isPolicyIdAllowed'

export default async (req, res) => {
  try {
    const { method, query } = req

    const policyId = query.policy_id

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
        const data = await jpgStore.getListings(policyId)

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
