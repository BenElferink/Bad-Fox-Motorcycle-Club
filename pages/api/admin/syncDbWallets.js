import connectDB from '../../../utils/mongo'
import Wallet from '../../../models/Wallet'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      body: { wallets },
    } = req

    switch (method) {
      case 'POST': {
        await Wallet.deleteMany({})

        const result = await Promise.all(
          wallets.map(({ stakeKey, addresses, assets }) => new Wallet({ stakeKey, addresses, assets }).save())
        )

        return res.status(201).json({ result })
      }

      default: {
        res.setHeader('Allow', 'POST')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
