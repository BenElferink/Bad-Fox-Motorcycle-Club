import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { firestore } from '@/utils/firebase'
import type { Trade } from '@/@types'
import { IS_DEV } from '@/constants'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const collection = firestore.collection('trades')
        const { docs } = await collection.where('withdrawTx', '==', '').get()

        const now = Date.now()
        const needToWithdraw = docs
          .map((doc) => ({ ...(doc.data() as Trade), id: doc.id }))
          .filter(({ timestamp }) => timestamp && now - timestamp > 3 * 60 * 1000)

        // for await (const { id } of needToWithdraw) {
        const url = (IS_DEV ? 'http://localhost:3000' : 'https://badfoxmc.com') + '/api/trade'
        const { id } = needToWithdraw[0] || {}

        if (!!id) {
          console.log('retrying', id)

          const {
            data: { txHash },
          } = await axios.post(url, {
            docId: id,
          })

          console.log('OK', txHash)
        }
        // }

        return res.status(200).json({ needToWithdraw })
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
