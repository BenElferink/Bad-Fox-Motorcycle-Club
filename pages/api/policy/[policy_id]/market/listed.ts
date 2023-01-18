import jpgStore, { FormattedListingOrSale } from '../../../../../utils/jpgStore'
import isPolicyIdAllowed from '../../../../../functions/isPolicyIdAllowed'
import { NextApiRequest, NextApiResponse } from 'next'
import { PolicyId } from '../../../../../@types'

export interface ResponsePolicyMarketListings {
  count: number
  items: FormattedListingOrSale[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponsePolicyMarketListings>) => {
  const { method, query } = req

  const policyId = query.policy_id as PolicyId

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).end(`This Policy ID is not allowed: ${policyId}`)
  }

  try {
    switch (method) {
      case 'GET': {
        const data = await jpgStore.getListings(policyId)

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
