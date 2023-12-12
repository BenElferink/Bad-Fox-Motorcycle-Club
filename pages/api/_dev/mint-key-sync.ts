import toHex from '../../../functions/formatters/hex/toHex'
import { BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID, BAD_MOTORCYCLE_WALLET } from '../../../constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import blockfrost from '../../../utils/blockfrost'
import fromHex from '../../../functions/formatters/hex/fromHex'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const utxos = await blockfrost.addressesUtxosAll(BAD_MOTORCYCLE_WALLET)

        const toCheck: {
          txHash: string
          keyId: string
        }[] = []

        utxos.forEach((utxo) => {
          utxo.amount.forEach((amount) => {
            if (amount.unit.indexOf(BAD_MOTORCYCLE_POLICY_ID) === 0) {
              toCheck.push({
                txHash: utxo.tx_hash,
                keyId: `${BAD_KEY_POLICY_ID}${toHex(fromHex(amount.unit.replace(BAD_MOTORCYCLE_POLICY_ID, '')).replace('BadMotorcycle', 'BadKey'))}`,
              })
            }
          })
        })

        const txHashes: string[] = []

        for await (const { keyId, txHash } of toCheck) {
          try {
            const token = await blockfrost.assetsById(keyId)

            console.log('key already minted', token.fingerprint)
          } catch (error) {
            console.log('key not minted', keyId)

            txHashes.push(txHash)
          }
        }

        console.log('done')

        return res.status(200).json({ txs: txHashes })
      }

      default: {
        res.setHeader('Allow', 'POST')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
