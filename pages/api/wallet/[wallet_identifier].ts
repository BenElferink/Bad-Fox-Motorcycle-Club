import blockfrost from '../../../utils/blockfrost'
import toHex from '../../../functions/formatters/hex/toHex'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import {
  ADA_HANDLE_POLICY_ID,
  BAD_FOX_POLICY_ID,
  BAD_KEY_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
} from '../../../constants'
import { NextApiRequest, NextApiResponse } from 'next'
import { PopulatedAsset, PopulatedWallet } from '../../../@types'
import fromHex from '../../../functions/formatters/hex/fromHex'
import populateAsset from '../../../functions/populateAsset'

interface Response extends PopulatedWallet {}

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
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
          (await Promise.all(
            walletAssetIds
              .filter((assetId) => assetId.indexOf(BAD_FOX_POLICY_ID) === 0)
              .map(async (assetId) => {
                const foundAsset = badFoxAssetsFile.find((asset) => asset.assetId === assetId)

                if (!foundAsset) {
                  const populatedAsset = await populateAsset({
                    policyId: BAD_FOX_POLICY_ID,
                    assetId,
                    withRanks: true,
                  })

                  return populatedAsset
                }

                return foundAsset
              })
          )) || []

        const badMotorcycleAssetsFile = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]
        const badMotorcycleAssets =
          (await Promise.all(
            walletAssetIds
              .filter((assetId) => assetId.indexOf(BAD_MOTORCYCLE_POLICY_ID) === 0)
              .map(async (assetId) => {
                const foundAsset = badMotorcycleAssetsFile.find((asset) => asset.assetId === assetId)

                if (!foundAsset) {
                  const populatedAsset = await populateAsset({
                    policyId: BAD_MOTORCYCLE_POLICY_ID,
                    assetId,
                    withRanks: true,
                  })

                  return populatedAsset
                }

                return foundAsset
              })
          )) || []

        const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
        const badKeyAssets = await Promise.all(
          walletAssetIds
            .filter((assetId) => assetId.indexOf(BAD_KEY_POLICY_ID) === 0)
            .map(async (assetId) => {
              const foundAsset = badKeyAssetsFile.find((asset) => asset.assetId === assetId)

              if (!foundAsset) {
                const populatedAsset = await populateAsset({
                  policyId: BAD_KEY_POLICY_ID,
                  assetId,
                  withRanks: false,
                })

                return populatedAsset
              }

              return foundAsset
            }) || []
        )

        const wallet = {
          stakeKey,
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: badFoxAssets,
            [BAD_MOTORCYCLE_POLICY_ID]: badMotorcycleAssets,
            [BAD_KEY_POLICY_ID]: badKeyAssets,
          },
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

export default handler
