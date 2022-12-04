import connectDB from '../../../utils/mongo'
import blockfrost from '../../../utils/blockfrost'
import Wallet from '../../../models/Wallet'
import { BAD_FOX_POLICY_ID, MARKETPLACE_ADDRESSES } from '../../../constants'

export default async (req, res) => {
  try {
    const { method, headers, body } = req

    switch (method) {
      case 'POST': {
        // try {
        //   blockfrost.api.verifyWebhookSignature(
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
            if (outputAmountItem.unit.indexOf(BAD_FOX_POLICY_ID) === 0) {
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

          res.status(202).end()
          await connectDB()

          for (let i = 0; i < assetTxMatrix.length; i++) {
            const [assetId, { from, to }] = assetTxMatrix[i]
            console.log(`Updating DB for asset ID ${assetId}, from address ${from}, to address ${to}`)

            if (MARKETPLACE_ADDRESSES.includes(from)) {
              console.log(`Skipping "from address" as it's excluded`)
            } else {
              let fromWallet = await Wallet.findOne({ addresses: { $in: [from] } })

              if (!fromWallet) {
                const sKey = await blockfrost.getStakeKeyWithWalletAddress(from)
                fromWallet = await Wallet.findOne({ stakeKey: sKey })

                if (!fromWallet) {
                  const assets = await blockfrost.getAssetIdsWithStakeKey(sKey, BAD_FOX_POLICY_ID)
                  const newWallet = new Wallet({
                    stakeKey: sKey,
                    addresses: [from],
                    assets: {
                      [BAD_FOX_POLICY_ID]: assets.filter((str) => str !== assetId),
                    },
                  })

                  await newWallet.save()
                } else {
                  fromWallet.addresses == fromWallet.addresses.includes(from)
                    ? fromWallet.addresses
                    : [...fromWallet.addresses, from]
                  fromWallet.assets[BAD_FOX_POLICY_ID] = fromWallet.assets[BAD_FOX_POLICY_ID].filter(
                    (str) => str !== assetId
                  )
                }

                await fromWallet.save()
              } else {
                fromWallet.assets[BAD_FOX_POLICY_ID] = fromWallet.assets[BAD_FOX_POLICY_ID].filter(
                  (str) => str !== assetId
                )

                await fromWallet.save()
              }
            }

            if (MARKETPLACE_ADDRESSES.includes(to)) {
              console.log(`Skipping "to address" as it's excluded`)
            } else {
              let toWallet = await Wallet.findOne({ addresses: { $in: [to] } })

              if (!toWallet) {
                const sKey = await blockfrost.getStakeKeyWithWalletAddress(to)
                toWallet = await Wallet.findOne({ stakeKey: sKey })

                if (!toWallet) {
                  const assets = await blockfrost.getAssetIdsWithStakeKey(sKey, BAD_FOX_POLICY_ID)
                  const newWallet = new Wallet({
                    stakeKey: sKey,
                    addresses: [to],
                    assets: {
                      [BAD_FOX_POLICY_ID]: assets,
                    },
                  })

                  await newWallet.save()
                } else {
                  toWallet.addresses == toWallet.addresses.includes(to)
                    ? toWallet.addresses
                    : [...toWallet.addresses, to]
                  toWallet.assets[BAD_FOX_POLICY_ID] = toWallet.assets[BAD_FOX_POLICY_ID].includes(assetId)
                    ? toWallet.assets[BAD_FOX_POLICY_ID]
                    : [...toWallet.assets[BAD_FOX_POLICY_ID], assetId]

                  await toWallet.save()
                }
              } else {
                toWallet.assets[BAD_FOX_POLICY_ID] = toWallet.assets[BAD_FOX_POLICY_ID].includes(assetId)
                  ? toWallet.assets[BAD_FOX_POLICY_ID]
                  : [...toWallet.assets[BAD_FOX_POLICY_ID], assetId]

                await toWallet.save()
              }
            }
          }
        })

        // return res.status(204).end()
        break
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
