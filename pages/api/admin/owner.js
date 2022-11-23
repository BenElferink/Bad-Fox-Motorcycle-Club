import { blockfrost } from '../../../utils/blockfrost'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const {
      method,
      query: { assetId },
    } = req

    switch (method) {
      case 'GET': {
        if (!assetId || typeof assetId !== 'string') {
          return res.status(400).end('Bad Request')
        }

        console.log('Fetching wallet information with asset ID:', assetId)

        const assetAddresses = await blockfrost.api.assetsAddresses(assetId)
        const walletAddress = assetAddresses[0]?.address ?? ''
        const addressInfo = await blockfrost.api.addresses(walletAddress)

        const payload = {
          isContract: addressInfo.script,
          stakeKey: addressInfo.stake_address || '',
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: addressInfo.amount.filter(
              ({ unit }) => unit.indexOf(BAD_FOX_POLICY_ID) === 0
            ),
            [BAD_MOTORCYCLE_POLICY_ID]: addressInfo.amount.filter(
              ({ unit }) => unit.indexOf(BAD_MOTORCYCLE_POLICY_ID) === 0
            ),
          },
        }

        console.log('Fetched wallet information:', payload)

        return res.status(200).json(payload)
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
