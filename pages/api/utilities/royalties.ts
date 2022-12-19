import blockfrost from '../../../utils/blockfrost'
import { ONE_MILLION, ROYALTY_WALLET } from '../../../constants'
import { NextApiRequest, NextApiResponse } from 'next'

interface Response {
  adaInWallet: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const wallet = await blockfrost.getWalletWithWalletAddress(ROYALTY_WALLET)
        const balanceLovelace = Number(
          wallet.amount.find((item) => item.unit === 'lovelace')?.quantity || ONE_MILLION
        )

        return res.status(200).json({
          adaInWallet: balanceLovelace / ONE_MILLION,
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
