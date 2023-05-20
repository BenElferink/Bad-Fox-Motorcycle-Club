import type { NextApiRequest, NextApiResponse } from 'next'
import mintKeyFromTxHash from '../../../functions/mintKeyFromTxHash'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    switch (method) {
      case 'POST': {
        const { txHash } = body

        const _txHash = await mintKeyFromTxHash(txHash)

        return res.status(200).json({ txHash: _txHash })
      }

      default: {
        res.setHeader('Allow', 'POST')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
