import { AppWallet, BlockfrostProvider, ForgeScript, Transaction } from '@meshsdk/core'
import { BAD_MOTORCYCLE_SIGNING_KEY, BLOCKFROST_API_KEY } from '../../../constants'
import type { NextApiRequest, NextApiResponse } from 'next'

const SLOT = '112468367'
const KEY_HASH = 'ff50205a39e4646460f1cf60c4ccf01b226f176b46c8b4c4e2299885'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  try {
    switch (method) {
      case 'GET': {
        const _provider = new BlockfrostProvider(BLOCKFROST_API_KEY)

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

        const _script = ForgeScript.fromNativeScript({
          type: 'all',
          scripts: [
            { type: 'before', slot: SLOT },
            { type: 'sig', keyHash: KEY_HASH },
          ],
        })

        _tx.setTimeToExpire(SLOT)
        _tx.burnAsset(_script, {
          unit: 'ab662f7402af587e64d217995e20f95ac3ae3ff8417d9158b04fbba84261644d6f746f726379636c6532303332',
          quantity: '1',
        })

        const _unsigTx = await _tx.build()
        const _sigTx = await _wallet.signTx(_unsigTx)
        const _txHash = await _wallet.submitTx(_sigTx)

        return res.status(200).json({ txHash: _txHash })
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
