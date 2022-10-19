import { resolveStakeAddress } from '@martifylabs/mesh'
import { blockfrost } from '../../../../utils/blockfrost'

export default async (req, res) => {
  try {
    const {
      method,
      query: { assetId },
    } = req

    switch (method) {
      case 'GET': {
        const walletAddress = await blockfrost.getWalletAddressWithAssetId(assetId)
        const stakeKey = resolveStakeAddress(walletAddress)

        return res.status(200).json({
          assetId,
          stakeKey,
          walletAddress,
        })
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
