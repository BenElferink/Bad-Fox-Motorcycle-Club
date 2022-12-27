import { NextApiRequest, NextApiResponse } from 'next'
import jpgStore from '../../../../utils/jpgStore'

interface Response {
  price: number
  timestamp: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query } = req

  const assetId = query.asset_id as string

  try {
    switch (method) {
      case 'GET': {
        const { price, timestamp } = await jpgStore.getAssetPurchasePrice(assetId)

        return res.status(200).json({
          price,
          timestamp,
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
