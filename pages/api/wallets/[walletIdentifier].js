import { blockfrost } from '../../../utils/blockfrost'
import toHex from '../../../functions/formatters/hex/toHex'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import { ADA_HANDLE_POLICY_ID, BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'

export default async (req, res) => {
  try {
    const {
      method,
      query: { walletIdentifier },
    } = req

    switch (method) {
      case 'GET': {
        let stakeKey = walletIdentifier.indexOf('stake1') === 0 ? walletIdentifier : null
        let walletAddress = walletIdentifier.indexOf('addr1') === 0 ? walletIdentifier : null
        const adaHandle = walletIdentifier.indexOf('$') === 0 ? walletIdentifier : null

        if (!stakeKey && !walletAddress && !adaHandle) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Please provide a valid wallet identifer: $handle / addr1... / stake1...',
          })
        }

        if (!stakeKey) {
          if (!walletAddress) {
            walletAddress = await blockfrost.getWalletAddressWithAssetId(
              `${ADA_HANDLE_POLICY_ID}${toHex(adaHandle.replace('$', ''))}`
            )
          }
          stakeKey = await blockfrost.getStakeKeyWithWalletAddress(walletAddress)
        }

        if (!walletAddress) {
          walletAddress = (await blockfrost.getWalletAddressesWithStakeKey(stakeKey))[0]
        }

        const badFoxAssets =
          (await blockfrost.getAssetIdsWithStakeKey(stakeKey, BAD_FOX_POLICY_ID))?.map((assetId) =>
            getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets').find((asset) => asset.assetId === assetId)
          ) || []

        const wallet = {
          stakeKey,
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: badFoxAssets,
          },
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
