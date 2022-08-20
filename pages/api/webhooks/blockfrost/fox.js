import connectDB from '../../../../utils/mongo'
import Wallet from '../../../../models/Wallet'
import getStakeKeyFromWalletAddress from '../../../../functions/blockfrost/getStakeKeyFromWalletAddress'
import getAssetsFromStakeKey from '../../../../functions/blockfrost/getAssetsFromStakeKey'
// import blockfrost from '../../../../utils/blockfrost'
// import { BLOCKFROST_WEBHOOK_AUTH_TOKEN } from '../../../../constants/api-keys'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'

export default async (req, res) => {
  try {
    await connectDB()

    const { method, headers, body } = req

    switch (method) {
      case 'POST': {
        // try {
        //   blockfrost.verifyWebhookSignature(
        //     JSON.stringify(body),
        //     headers['blockfrost-signature'],
        //     BLOCKFROST_WEBHOOK_AUTH_TOKEN
        //   )
        // } catch (error) {
        //   console.error(error)
        //   return res.status(400).send('Signature is invalid!')
        // }

        console.log(`Webhook triggered with ${body.payload.length} payloads`)

        body.payload.forEach(async (payloadItem, idx) => {
          const assetIds = []
          const assetTxs = {}

          console.log(`Scanning payload #${idx + 1} with TX hash: ${payloadItem.tx.hash}`)

          payloadItem.tx.output_amount.forEach((outputAmountItem) => {
            if (outputAmountItem.unit.indexOf(FOX_POLICY_ID) === 0) {
              assetIds.push(outputAmountItem.unit)
            }
          })

          console.log(`Detected ${assetIds.length} asset IDs`)

          payloadItem.inputs.forEach((inputItem) => {
            const fromAddress = inputItem.address

            inputItem.amount.forEach((amountItem) => {
              const assetId = amountItem.unit

              if (assetIds.includes(assetId)) {
                if (assetTxs[assetId]) {
                  assetTxs[assetId].from = fromAddress
                } else {
                  assetTxs[assetId] = { from: fromAddress }
                }
              }
            })
          })

          payloadItem.outputs.forEach((outputItem) => {
            const toAddress = outputItem.address

            outputItem.amount.forEach((amountItem) => {
              const assetId = amountItem.unit

              if (assetIds.includes(assetId)) {
                if (assetTxs[assetId].from !== toAddress) {
                  assetTxs[assetId].to = toAddress
                } else {
                  delete assetTxs[assetId]
                }
              }
            })
          })

          const assetTxMatrix = Object.entries(assetTxs)
          console.log(`Detected ${assetTxMatrix.length} asset TXs`)

          for (let i = 0; i < assetTxMatrix.length; i++) {
            const [assetId, { from, to }] = assetTxMatrix[i]
            console.log(`Updating DB for asset ID ${assetId}, from address ${from}, to address ${to}`)

            if (EXCLUDE_ADDRESSES.includes(from)) {
              console.log(`Skipping "from address" as it's excluded`)
            } else {
              let fromWallet = await Wallet.findOne({ addresses: { $in: [from] } })

              if (!fromWallet) {
                const sKey = await getStakeKeyFromWalletAddress(from)
                fromWallet = await Wallet.findOne({ stakeKey: sKey })

                if (!fromWallet) {
                  const assets = await getAssetsFromStakeKey(sKey, FOX_POLICY_ID)
                  const newWallet = new Wallet({
                    stakeKey: sKey,
                    addresses: [from],
                    assets: {
                      [FOX_POLICY_ID]: assets.filter((str) => str !== assetId),
                    },
                  })

                  await newWallet.save()
                } else {
                  fromWallet.addresses == fromWallet.addresses.includes(from)
                    ? fromWallet.addresses
                    : [...fromWallet.addresses, from]
                  fromWallet.assets[FOX_POLICY_ID] = fromWallet.assets[FOX_POLICY_ID].filter(
                    (str) => str !== assetId
                  )
                }
              } else {
                fromWallet.assets[FOX_POLICY_ID] = fromWallet.assets[FOX_POLICY_ID].filter(
                  (str) => str !== assetId
                )
              }
            }

            if (EXCLUDE_ADDRESSES.includes(to)) {
              console.log(`Skipping "to address" as it's excluded`)
            } else {
              let toWallet = await Wallet.findOne({ addresses: { $in: [to] } })

              if (!toWallet) {
                const sKey = await getStakeKeyFromWalletAddress(to)
                toWallet = await Wallet.findOne({ addresses: { $in: [to] } })

                if (!toWallet) {
                  const assets = await getAssetsFromStakeKey(sKey, FOX_POLICY_ID)

                  const newWallet = new Wallet({
                    stakeKey: sKey,
                    addresses: [to],
                    assets: {
                      [FOX_POLICY_ID]: assets,
                    },
                  })

                  await newWallet.save()
                } else {
                  toWallet.addresses == toWallet.addresses.includes(to)
                    ? toWallet.addresses
                    : [...toWallet.addresses, to]
                  toWallet.assets[FOX_POLICY_ID] = toWallet.assets[FOX_POLICY_ID].includes(assetId)
                    ? toWallet.assets[FOX_POLICY_ID]
                    : [...toWallet.assets[FOX_POLICY_ID], assetId]
                }
              } else {
                toWallet.assets[FOX_POLICY_ID] = toWallet.assets[FOX_POLICY_ID].includes(assetId)
                  ? toWallet.assets[FOX_POLICY_ID]
                  : [...toWallet.assets[FOX_POLICY_ID], assetId]
              }
            }
          }
        })

        return res.status(204).end()
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
