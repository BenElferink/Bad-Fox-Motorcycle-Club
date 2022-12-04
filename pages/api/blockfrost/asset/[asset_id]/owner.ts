import blockfrost from '../../../../../utils/blockfrost'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../../../../constants'
import { NextApiRequest, NextApiResponse } from 'next'
import { OwningWallet } from '../../../../../@types'

interface Response extends OwningWallet {}

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query } = req

  const assetId = query.asset_id

  if (!assetId || typeof assetId !== 'string') {
    return res.status(400).end('Bad Request')
  }

  try {
    switch (method) {
      case 'GET': {
        console.log('Fetching wallet with asset ID:', assetId)

        const assetAddresses = await blockfrost.api.assetsAddresses(assetId)
        const walletAddress = assetAddresses[0]?.address ?? ''
        const addressInfo = await blockfrost.api.addresses(walletAddress)

        const payload = {
          isContract: addressInfo.script,
          stakeKey: addressInfo.stake_address || '',
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: addressInfo.amount.filter(({ unit }) => unit.indexOf(BAD_FOX_POLICY_ID) === 0),
            [BAD_MOTORCYCLE_POLICY_ID]: addressInfo.amount.filter(
              ({ unit }) => unit.indexOf(BAD_MOTORCYCLE_POLICY_ID) === 0
            ),
          },
        }

        console.log('Fetched wallet:', payload)

        return res.status(200).json(payload)
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
