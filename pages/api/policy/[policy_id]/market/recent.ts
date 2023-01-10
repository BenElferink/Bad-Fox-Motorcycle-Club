import jpgStore from '../../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../../functions/isPolicyIdAllowed'
import { NextApiRequest, NextApiResponse } from 'next'
import { JpgRecentItem, PolicyId } from '../../../../../@types'

interface Response {
  count: number
  items: JpgRecentItem[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query } = req

  const policyId = query.policy_id as PolicyId
  const sold = !!query.sold && query.sold != 'false' && query.sold != '0'
  const page = (() => {
    const min = 1
    const num = Number(query.page)

    return isNaN(num) ? min : num >= min ? num : min
  })()

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).end(`This Policy ID is not allowed: ${policyId}`)
  }

  try {
    switch (method) {
      case 'GET': {
        const data = await jpgStore.getRecents({ policyId, sold, page })

        return res.status(200).json({
          count: data.length,
          items: data,
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
