import connectDB from '../../../../utils/mongo'
import HolderSnapshot from '../../../../models/HolderSnapshot'
import foxAssets from '../../../../data/assets/fox'
import getWalletAddressOfAsset from '../../../../functions/blockfrost/getWalletAddressOfAsset'
import getStakeKeyFromWalletAddress from '../../../../functions/blockfrost/getStakeKeyFromWalletAddress'
import POLICY_IDS, { FOX_POLICY_ID } from '../../../../constants/policy-ids'
import { ADMIN_CODE } from '../../../../constants/api-keys'
import {
  BAD_FOX_WALLET,
  CNFT_IO_WALLET,
  EPOCH_ART_WALLET,
  JPG_STORE_WALLET,
} from '../../../../constants/addresses'

const VOLUME = 500000 // 1000000
const ROYALTY_FEE = 0.07
const ROYALTY_TO_GIVE = 0.8
const ROYALTY_SHARE = VOLUME * ROYALTY_FEE * ROYALTY_TO_GIVE

const EXCLUDE_ADDRESSES = [BAD_FOX_WALLET, JPG_STORE_WALLET, CNFT_IO_WALLET, EPOCH_ART_WALLET]

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId },
    } = req

    if (!policyId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query params required: policyId',
      })
    }

    if (!Object.values(POLICY_IDS).includes(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        const dbSnapshots = await HolderSnapshot.find({ policyId })

        return res.status(200).json({
          count: dbSnapshots.length,
          snapshots: dbSnapshots,
        })
      }

      case 'HEAD': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        res.status(202).end()

        let totalAssetCount = 0
        const assets = policyId === foxAssets.policyId ? foxAssets.assets : []
        const holders = []

        // associate all asset IDs to their wallets (collect stake key and wallet addresses)

        for (const { asset: assetId } of assets) {
          console.log('\nProcessing asset:', assetId)

          const walletAddress = await getWalletAddressOfAsset(assetId)

          if (EXCLUDE_ADDRESSES.includes(walletAddress)) {
            console.log('This wallet is excluded!')
          } else {
            const holderWithIncludedWalletAddress = holders.find((item) => item.addresses.includes(walletAddress))

            const stakeKey =
              holderWithIncludedWalletAddress?.stakeKey || (await getStakeKeyFromWalletAddress(walletAddress))

            const holderIndex = holders.findIndex((item) => item.stakeKey === stakeKey)

            if (holderIndex === -1) {
              holders.push({
                stakeKey,
                addresses: [walletAddress],
                assets: [assetId],
              })
            } else {
              if (!holderWithIncludedWalletAddress) {
                holders[holderIndex].addresses.push(walletAddress)
              }

              holders[holderIndex].assets.push(assetId)
            }

            totalAssetCount++
          }
        }

        // count the payouts for every holder (only for royalties)

        let totalAdaPayout = 0
        const adaPerAsset = ROYALTY_SHARE / totalAssetCount

        const wallets = holders
          .map((item) => {
            const assetCount = item.assets.length
            const adaForAssets = Math.floor(assetCount * adaPerAsset)

            let traitCount = 0
            let traitPayout = 0

            if (policyId === FOX_POLICY_ID) {
              traitPayout = 10

              for (const assetId of item.assets) {
                const {
                  onchain_metadata: {
                    attributes: { Mouth },
                  },
                } = assets.find(({ asset }) => asset === assetId)

                if (Mouth === '(F) Crypto' || Mouth === '(F) Cash Bag') {
                  traitCount++
                }
              }
            }

            const adaForTraits = Math.floor(traitCount * traitPayout)

            const totalAda = adaForAssets + adaForTraits
            const totalLovelace = totalAda * 1000000

            totalAdaPayout += totalAda

            return {
              ...item,
              payout: {
                adaForAssets,
                adaForTraits,
                totalAda,
                totalLovelace,
              },
            }
          })
          .sort((a, b) => b.assets.length - a.assets.length)

        const newSnapshot = new HolderSnapshot({
          policyId,
          timestamp: Date.now(),
          totalAssetCount,
          totalAdaPayout,
          wallets,
        })

        await newSnapshot.save()

        console.log('\nDone!')

        // delete all other snapshots except for the recent one
        const dbSnapshots = await HolderSnapshot.find({ policyId })

        await Promise.all(
          dbSnapshots
            .filter((item) => item._id.toString() !== newSnapshot._id.toString())
            .map((item) => HolderSnapshot.deleteOne({ _id: item._id }))
        )

        break
      }

      default: {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'Method does not exist for this route',
        })
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
