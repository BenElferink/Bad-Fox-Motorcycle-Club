import type { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '../../../utils/firebase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const collection = firestore.collection('trades')
        const { docs } = await collection.where('withdrawTx', '==', '').get()

        const needToWithdraw = docs.map((doc) => doc.id)

        return res.status(200).json({
          needToWithdraw,
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
