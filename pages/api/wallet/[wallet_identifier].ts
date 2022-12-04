import blockfrost from '../../../utils/blockfrost'
import toHex from '../../../functions/formatters/hex/toHex'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import { ADA_HANDLE_POLICY_ID, BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../../constants'
import { NextApiRequest, NextApiResponse } from 'next'
import { PopulatedAsset, PopulatedWallet } from '../../../@types'

interface Response extends PopulatedWallet {}

export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query } = req

  const walletIdentifier = query.wallet_identifier as string

  let stakeKey = walletIdentifier.indexOf('stake1') === 0 ? walletIdentifier : null
  let walletAddress = walletIdentifier.indexOf('addr1') === 0 ? walletIdentifier : null
  const adaHandle = walletIdentifier.indexOf('$') === 0 ? walletIdentifier : null

  if (!stakeKey && !walletAddress && !adaHandle) {
    return res.status(400).end('Please provide a valid wallet identifer: $handle / addr1... / stake1...')
  }

  try {
    switch (method) {
      case 'GET': {
        if (!stakeKey) {
          if (!walletAddress) {
            walletAddress = await blockfrost.getWalletAddressWithAssetId(
              `${ADA_HANDLE_POLICY_ID}${toHex((adaHandle as string).replace('$', ''))}`
            )
          }
          stakeKey = await blockfrost.getStakeKeyWithWalletAddress(walletAddress)
        }

        if (!walletAddress) {
          walletAddress = (await blockfrost.getWalletAddressesWithStakeKey(stakeKey))[0]
        }

        const walletAssetIds = await blockfrost.getAssetIdsWithStakeKey(stakeKey)

        const badFoxAssetsFile = getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]
        const badFoxAssets =
          walletAssetIds
            .filter((assetId) => assetId.indexOf(BAD_FOX_POLICY_ID) === 0)
            .map((assetId) => badFoxAssetsFile.find((asset) => asset.assetId === assetId) as PopulatedAsset) || []

        const badMotorcycleAssetsFile = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]
        const badMotorcycleAssets =
          walletAssetIds
            .filter((assetId) => assetId.indexOf(BAD_MOTORCYCLE_POLICY_ID) === 0)
            .map(
              (assetId) => badMotorcycleAssetsFile.find((asset) => asset.assetId === assetId) as PopulatedAsset
            ) || []

        const wallet = {
          stakeKey,
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: badFoxAssets,
            [BAD_MOTORCYCLE_POLICY_ID]: badMotorcycleAssets,
          },
          ownsAssets: !!badFoxAssets.length || !!badMotorcycleAssets.length,
        }

        return res.status(200).json(wallet)
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
