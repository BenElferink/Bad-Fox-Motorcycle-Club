import type { NextApiRequest, NextApiResponse } from 'next'
import { AppWallet, BlockfrostProvider, Transaction } from '@meshsdk/core'
import { firestore } from '../../../utils/firebase'
import BadApi from '../../../utils/badApi'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import populateAsset from '../../../functions/populateAsset'
import type { PopulatedAsset, Trade } from '../../../@types'
import {
  BAD_FOX_POLICY_ID,
  BAD_KEY_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
  BLOCKFROST_API_KEY,
  TRADE_APP_MNEMONIC,
  TRADE_APP_WALLET,
} from '../../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    switch (method) {
      case 'POST': {
        const { docId } = body

        const collection = firestore.collection('trades')
        const doc = await collection.doc(docId).get()

        const docData = doc.data()

        if (!docData) {
          throw new Error('doc not found')
        }

        const { stakeKey, type, requestedTokenId, depositTx, withdrawTx } = docData as Trade

        if (withdrawTx) {
          throw new Error('Already withdrawn')
        }

        const badApi = new BadApi()
        const txData = await badApi.transaction.getData(depositTx, { withUtxos: true })

        if (!txData) {
          throw new Error('TX not submitted yet')
        }

        const receivedTokenIds: string[] = []

        for (const { address, tokens } of txData.utxos || []) {
          for (const { tokenId } of tokens) {
            if (tokenId.indexOf(BAD_FOX_POLICY_ID) == 0 && address.to === TRADE_APP_WALLET) {
              receivedTokenIds.push(tokenId)
            }

            if (tokenId.indexOf(BAD_MOTORCYCLE_POLICY_ID) == 0 && address.to === TRADE_APP_WALLET) {
              receivedTokenIds.push(tokenId)
            }
          }
        }

        if (!type || (type === '1:1' && receivedTokenIds.length !== 1) || (type === '2:1' && receivedTokenIds.length !== 2)) {
          throw new Error(`Received ${receivedTokenIds.length} asset(s) from TX for type ${type}`)
        }

        const tradeWallet = await badApi.wallet.getData(TRADE_APP_WALLET, { withTokens: true })
        const requestingWallet = await badApi.wallet.getData(stakeKey)
        let requestedUnit = ''

        if (type === '1:1') {
          const badFoxAssetsFile = getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]
          const badMotorcycleAssetsFile = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]

          const treasuryFoxes = await Promise.all(
            (tradeWallet.tokens?.filter(({ tokenId }) => tokenId.indexOf(BAD_FOX_POLICY_ID) == 0) || []).map(async ({ tokenId }) => {
              const foundAsset = badFoxAssetsFile.find((asset) => asset.tokenId === tokenId)

              if (!foundAsset) {
                return await populateAsset({
                  assetId: tokenId,
                  policyId: BAD_FOX_POLICY_ID,
                })
              }

              return foundAsset
            })
          )

          if (!!treasuryFoxes.find((item) => item.tokenId === requestedTokenId)) {
            requestedUnit = requestedTokenId
          } else {
            const treasuryBikes = await Promise.all(
              (tradeWallet.tokens?.filter(({ tokenId }) => tokenId.indexOf(BAD_MOTORCYCLE_POLICY_ID) == 0) || []).map(async ({ tokenId }) => {
                const foundAsset = badMotorcycleAssetsFile.find((asset) => asset.tokenId === tokenId)

                if (!foundAsset) {
                  return await populateAsset({
                    assetId: tokenId,
                    policyId: BAD_MOTORCYCLE_POLICY_ID,
                  })
                }

                return foundAsset
              })
            )

            if (!!treasuryBikes.find((item) => item.tokenId === requestedTokenId)) {
              requestedUnit = requestedTokenId
            } else {
              throw new Error(`Token ${requestedTokenId} not available for TX of type ${type}`)
            }
          }
        } else {
          const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]

          const treasuryKeys = (
            await Promise.all(
              (tradeWallet.tokens?.filter(({ tokenId }) => tokenId.indexOf(BAD_KEY_POLICY_ID) == 0) || []).map(async ({ tokenId }) => {
                const foundAsset = badKeyAssetsFile.find((asset) => asset.tokenId === tokenId)

                if (!foundAsset) {
                  return await populateAsset({
                    assetId: tokenId,
                    policyId: BAD_KEY_POLICY_ID,
                    populateMintTx: true,
                  })
                }

                return foundAsset
              })
            )
          ).sort((a, b) => (a?.mintBlockHeight || 0) - (b?.mintBlockHeight || 0))

          if (!treasuryKeys.length) {
            throw new Error(`No more keys available for TX of type ${type}`)
          }

          if (!!treasuryKeys.find((item) => item.tokenId === requestedTokenId)) {
            requestedUnit = requestedTokenId
          } else {
            requestedUnit = treasuryKeys[0].tokenId
          }
        }

        const provider = new BlockfrostProvider(BLOCKFROST_API_KEY)
        const wallet = new AppWallet({
          networkId: 1,
          fetcher: provider,
          submitter: provider,
          key: {
            type: 'mnemonic',
            words: TRADE_APP_MNEMONIC,
          },
        })

        const tx = new Transaction({ initiator: wallet }).sendAssets({ address: requestingWallet.addresses[0].address }, [
          {
            unit: requestedUnit,
            quantity: '1',
          },
        ])

        const unsignedTx = await tx.build()
        const signedTx = await wallet.signTx(unsignedTx)
        const txHash = await wallet.submitTx(signedTx)

        await collection.doc(docId).update({
          withdrawTx: txHash,
        })

        return res.status(200).json({
          txHash,
        })
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
