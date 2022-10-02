import { blockfrost } from '../../../utils/blockfrost'
import toHex from '../../../functions/formatters/hex/toHex'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import foxAssetsFile from '../../../data/assets/bad-fox.json'

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
              // ADA Handle Policy ID
              `f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a${toHex(adaHandle.replace('$', ''))}`
            )
          }
          stakeKey = await blockfrost.getStakeKeyWithWalletAddress(walletAddress)
        }

        const badFoxAssets =
          (await blockfrost.getAssetIdsWithStakeKey(stakeKey, BAD_FOX_POLICY_ID))?.map((assetId) =>
            foxAssetsFile.assets.find((asset) => asset.assetId === assetId)
          ) || []

        const wallet = {
          stakeKey,
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
