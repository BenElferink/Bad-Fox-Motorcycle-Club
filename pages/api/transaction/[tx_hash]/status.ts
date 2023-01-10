import blockfrost from '../../../../utils/blockfrost'
import { NextApiRequest, NextApiResponse } from 'next'

interface Response {
  txHash: string
  submitted: boolean
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query } = req

  const txHash = query.tx_hash

  if (!txHash || typeof txHash !== 'string') {
    return res.status(400).end()
  }

  try {
    switch (method) {
      case 'GET': {
        console.log('Fetching TX with TX Hash:', txHash)

        await blockfrost.api.txs(txHash)

        console.log('Fetched TX with TX Hash:', txHash)

        return res.status(200).json({
          txHash,
          submitted: true,
        })
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error: any) {
    console.error(error)

    if (error?.status_code === 404 || error?.message === 'The requested component has not been found.') {
      return res.status(200).json({
        txHash,
        submitted: false,
      })
    }

    return res.status(500).end()
  }
}

export default handler
