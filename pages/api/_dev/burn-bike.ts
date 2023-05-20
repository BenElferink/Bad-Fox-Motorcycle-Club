import { AppWallet, BlockfrostProvider, ForgeScript, Transaction } from '@meshsdk/core'
import {
  BAD_MOTORCYCLE_POLICY_ID,
  BAD_MOTORCYCLE_SIGNING_KEY,
  BAD_MOTORCYCLE_WALLET,
  BLOCKFROST_API_KEY,
} from '../../../constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import blockfrost from '../../../utils/blockfrost'

const SLOT = '112468367'
const KEY_HASH = 'ff50205a39e4646460f1cf60c4ccf01b226f176b46c8b4c4e2299885'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        return res.status(401).end('Dev route only!')

        const _provider = new BlockfrostProvider(BLOCKFROST_API_KEY)

        const _script = ForgeScript.fromNativeScript({
          type: 'all',
          scripts: [
            { type: 'before', slot: SLOT },
            { type: 'sig', keyHash: KEY_HASH },
          ],
        })

        const utxos = await blockfrost.addressesUtxosAll(BAD_MOTORCYCLE_WALLET)

        const matrix: string[][] = []

        utxos.forEach((utxo) => {
          utxo.amount.forEach((amount) => {
            if (amount.unit.indexOf(BAD_MOTORCYCLE_POLICY_ID) === 0) {
              if (!matrix.length || matrix[matrix.length - 1].length >= 50) {
                matrix.push([])
              }

              matrix[matrix.length - 1].push(amount.unit)
            }
          })
        })

        const txHashes: string[] = []

        for await (const tokenIds of matrix) {
          const _wallet = new AppWallet({
            networkId: 1,
            fetcher: _provider,
            submitter: _provider,
            key: {
              type: 'cli',
              payment: BAD_MOTORCYCLE_SIGNING_KEY,
            },
          })

          const _tx = new Transaction({ initiator: _wallet })
          _tx.setTimeToExpire(SLOT)

          for (const tokenId of tokenIds) {
            _tx.burnAsset(_script, {
              unit: tokenId,
              quantity: '1',
            })
          }

          const _unsigTx = await _tx.build()
          const _sigTx = await _wallet.signTx(_unsigTx)
          const _txHash = await _wallet.submitTx(_sigTx)

          txHashes.push(_txHash)
        }

        return res.status(200).json({ txs: txHashes })
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
