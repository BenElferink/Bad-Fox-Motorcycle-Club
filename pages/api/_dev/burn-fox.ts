import { AppWallet, BlockfrostProvider, ForgeScript, Transaction } from '@meshsdk/core'
import { BAD_FOX_SIGNING_KEY, BLOCKFROST_API_KEY } from '../../../constants'
import type { NextApiRequest, NextApiResponse } from 'next'

const SLOT = '112310414'
const KEY_HASH = '17b7a753a6aabb96b8fb6a64086f41cc1ac1527f9ce8c413a9950869'

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
            payment: BAD_FOX_SIGNING_KEY,
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
        _tx
          .burnAsset(_script, {
            unit: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7831373930',
            quantity: '1',
          })
          .burnAsset(_script, {
            unit: 'fa669150ad134964e86b2fa7275a12072f61b438d0d44204d3a2f967426164466f7834353539',
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
