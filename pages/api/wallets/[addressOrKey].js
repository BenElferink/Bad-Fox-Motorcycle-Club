import connectDB from '../../../utils/mongo'
import Wallet from '../../../models/Wallet'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { addressOrKey },
    } = req

    switch (method) {
      case 'GET': {
        const stakeKey = addressOrKey.indexOf('stake1') === 0 ? addressOrKey : null
        const walletAddress = addressOrKey.indexOf('addr1') === 0 ? addressOrKey : null

        if (!stakeKey && !walletAddress) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Please provide a valid wallet address or stake key',
          })
        }

        const wallet = await Wallet.findOne(stakeKey ? { stakeKey } : { addresses: { $in: [walletAddress] } })

        if (!wallet) {
          return res.status(404).end({
            type: 'NOT_FOUND',
            message: 'Wallet not found',
          })
        }

        return res.status(200).json(wallet)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
