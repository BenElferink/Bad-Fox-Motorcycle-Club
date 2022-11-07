import Wallet from '../../../models/Wallet'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const {
      method,
      body: { wallets },
    } = req

    switch (method) {
      case 'POST': {
        await Wallet.deleteMany({})

        const result = await Promise.all(
          wallets.map(({ stakeKey, addresses, assets }) =>
            new Wallet({
              stakeKey,
              addresses,
              assets: {
                [BAD_FOX_POLICY_ID]: assets,
                [BAD_MOTORCYCLE_POLICY_ID]: [],
              },
            }).save()
          )
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
