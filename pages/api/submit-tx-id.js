import connectDB from '../../utils/mongo'
import { blockfrost } from '../../utils/blockfrost'
import Transaction from '../../models/Transaction'
import { BAD_FOX_POLICY_ID } from '../../constants/policy-ids'
import { JPG_STORE_WALLET } from '../../constants/addresses'

export default async (req, res) => {
  try {
    await connectDB()

    const { method, body } = req

    switch (method) {
      case 'GET': {
        const txs = await Transaction.find()

        return res.status(200).json({
          count: txs.length,
          txs,
        })
      }

      case 'POST': {
        const { txHash } = body

        if (!txHash) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Please provide the following body: { txHash: "" }',
          })
        }

        let tx = await Transaction.findOne({ hash: txHash })

        if (tx) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'This transaction ID has already been submitted',
          })
        }

        const blockTx = await blockfrost.api.txs(txHash)

        const startDate = 1661979599000 // new Date(2022, 7, 31, 23, 59, 59).getTime() // 2022-08-31T20:59:59.000Z
        const endDate = 1662584399000 // new Date(2022, 8, 7, 23, 59, 59).getTime() // 2022-09-07T20:59:59.000Z
        const txDate = Number(`${blockTx.block_time}000`)

        if (txDate <= startDate) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'The transaction happened before September the 1st',
          })
        }

        if (txDate > endDate) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'The transaction happened after September the 7th',
          })
        }

        const utxos = await blockfrost.api.txsUtxos(txHash)
        let boughtAsset = ''

        utxos.inputs.forEach(({ address, amount }) => {
          if (address === JPG_STORE_WALLET) {
            amount.forEach(({ unit }) => {
              if (unit.indexOf(BAD_FOX_POLICY_ID) === 0) {
                boughtAsset = unit
              }
            })
          }
        })

        if (!boughtAsset) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'The transaction ID did not include a Bad Fox NFT from jpg.store',
          })
        }

        let buyingAddress = ''

        utxos.outputs.forEach(({ address, amount }) => {
          amount.forEach(({ unit }) => {
            if (unit === boughtAsset) {
              buyingAddress = address
            }
          })
        })

        tx = new Transaction({
          hash: txHash,
          timestamp: txDate,
          asset: boughtAsset,
          address: buyingAddress,
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
