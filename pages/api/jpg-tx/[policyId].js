import connectDB from '../../../utils/mongo'
import { blockfrost } from '../../../utils/blockfrost'
import Setting from '../../../models/Setting'
import JpgTx from '../../../models/JpgTx'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'
import { JPG_STORE_WALLET } from '../../../constants/addresses'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { policyId },
      body: { txHash },
    } = req

    if (!isPolicyIdAllowed(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        const setting = await Setting.findOne({ policyId })

        const txs = await JpgTx.find({
          timestamp: {
            $gte: new Date(setting.submitTx.startDate).getTime(),
            $lte: new Date(setting.submitTx.endDate).getTime(),
          },
        })

        return res.status(200).json({
          count: txs.length,
          setting: setting.submitTx,
          txs,
        })
      }

      case 'POST': {
        if (!txHash) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Please provide the following body: { txHash: "" }',
          })
        }

        let tx = await JpgTx.findOne({ txHash })

        if (tx) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'TX already submitted',
          })
        }

        const setting = await Setting.findOne({ policyId })
        const now = Date.now()

        if (
          now < new Date(setting.submitTx.startDate).getTime() ||
          now >= new Date(setting.submitTx.endDate).getTime()
        ) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Currently out of date range',
          })
        }

        const blockTx = await blockfrost.api.txs(txHash)
        const txTimestamp = Number(`${blockTx.block_time}000`)

        if (
          txTimestamp < new Date(setting.submitTx.startDate).getTime() ||
          txTimestamp >= new Date(setting.submitTx.endDate).getTime()
        ) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'TX out of date range',
          })
        }

        const utxos = await blockfrost.api.txsUtxos(txHash)
        let assetId = ''

        utxos.inputs.forEach(({ address, amount }) => {
          if (address === JPG_STORE_WALLET) {
            amount.forEach(({ unit }) => {
              if (unit.indexOf(policyId) === 0) {
                assetId = unit
              }
            })
          }
        })

        if (!assetId) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: "TX didn't include a required asset from jpg.store",
          })
        }

        let boughtByAddress = ''

        utxos.outputs.forEach(({ address, amount }) => {
          amount.forEach(({ unit }) => {
            if (unit === assetId) {
              boughtByAddress = address
            }
          })
        })

        tx = new JpgTx({
          txHash,
          timestamp: txTimestamp,
          assetId,
          boughtByAddress,
        })

        await tx.save()

        return res.status(201).json({})
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'POST')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
