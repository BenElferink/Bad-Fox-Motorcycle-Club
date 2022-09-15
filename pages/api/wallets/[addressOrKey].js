import connectDB from '../../../utils/mongo'
import { blockfrost } from '../../../utils/blockfrost'
import Wallet from '../../../models/Wallet'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { addressOrKey },
    } = req

    switch (method) {
      case 'GET': {
        let stakeKey = addressOrKey.indexOf('stake1') === 0 ? addressOrKey : null
        const walletAddress = addressOrKey.indexOf('addr1') === 0 ? addressOrKey : null

        if (!stakeKey && !walletAddress) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Please provide a valid wallet address or stake key',
          })
        }

        let wallet = await Wallet.findOne(stakeKey ? { stakeKey } : { addresses: { $in: [walletAddress] } })

        if (!wallet) {
          if (!stakeKey) {
            stakeKey = await blockfrost.getStakeKeyWithWalletAddress(walletAddress)
          }

          const assets = await blockfrost.getAssetIdsWithStakeKey(stakeKey, BAD_FOX_POLICY_ID)
          const addresses = await blockfrost.getWalletAddressesWithStakeKey(stakeKey)

          wallet = new Wallet({
            stakeKey,
            addresses,
            assets: {
              [BAD_FOX_POLICY_ID]: assets,
            },
          })

          await wallet.save()
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
