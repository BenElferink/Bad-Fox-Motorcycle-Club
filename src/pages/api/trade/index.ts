import type { NextApiRequest, NextApiResponse } from 'next';
import { Asset, BlockfrostProvider, keepRelevant, MeshWallet, Transaction } from '@meshsdk/core';
import { firestore } from '@/src/utils/firebase';
import badLabsApi from '@/src/utils/badLabsApi';
import type { Trade } from '@/src/@types';
import {
  BAD_FOX_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
  BAD_FOX_3D_POLICY_ID,
  BLOCKFROST_API_KEY,
  TRADE_APP_MNEMONIC,
  TRADE_APP_WALLET,
  BAD_FOX_WALLET,
  BAD_MOTORCYCLE_WALLET,
} from '@/src/constants';

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  try {
    switch (method) {
      case 'POST': {
        const { docId } = body;

        const collection = firestore.collection('trades');
        const doc = await collection.doc(docId).get();
        const docData = doc.data();

        if (!docData) throw new Error('doc not found');

        const { stakeKey, depositAmount, depositTx, withdrawAmount, withdrawTx } = docData as Trade;

        if (!depositTx) throw new Error('deposit TX not submitted yet');
        if (!!withdrawTx) throw new Error('already withdrawn for this doc');

        const txData = await badLabsApi.transaction.getData(depositTx, { withUtxos: true });

        if (!txData) throw new Error('deposit TX not confirmed yet');
        if (!docData.timestamp) await collection.doc(docId).update({ timestamp: Date.now() });

        const receivedTokenIds: string[] = [];

        for (const { address, tokens } of txData.utxos || []) {
          for (const { tokenId } of tokens) {
            if (tokenId.indexOf(BAD_FOX_POLICY_ID) == 0 && address.to === BAD_FOX_WALLET) {
              receivedTokenIds.push(tokenId);
            }

            if (tokenId.indexOf(BAD_MOTORCYCLE_POLICY_ID) == 0 && address.to === BAD_MOTORCYCLE_WALLET) {
              receivedTokenIds.push(tokenId);
            }
          }
        }

        if (receivedTokenIds.length !== depositAmount) throw new Error(`received ${receivedTokenIds.length}/${depositAmount} asset(s) from TX`);

        const recipientWallet = await badLabsApi.wallet.getData(stakeKey);
        const recipientAddress = recipientWallet.addresses[0].address;
        const tradeWallet = await badLabsApi.wallet.getData(TRADE_APP_WALLET, { withTokens: true });
        const tradeWallet3dAssets = tradeWallet.tokens?.filter((x) => x.tokenId.indexOf(BAD_FOX_3D_POLICY_ID) === 0);

        if (!tradeWallet3dAssets?.length) throw new Error('no available assets');
        if (withdrawAmount > tradeWallet3dAssets.length) throw new Error(`requesting ${withdrawAmount}/${tradeWallet3dAssets.length} asset(s)`);

        const usedIndexes: number[] = [];
        const assetsToSend: Asset[] = [];

        for (let i = 0; i < withdrawAmount; i++) {
          const random = Math.floor(Math.random() * tradeWallet3dAssets.length);

          if (!usedIndexes.includes(random)) {
            usedIndexes.push(random);
            assetsToSend.push({
              unit: tradeWallet3dAssets[random].tokenId,
              quantity: '1',
            });
          } else {
            i--;
          }
        }

        const provider = new BlockfrostProvider(BLOCKFROST_API_KEY);
        const wallet = new MeshWallet({
          networkId: 1,
          fetcher: provider,
          submitter: provider,
          key: {
            type: 'mnemonic',
            words: TRADE_APP_MNEMONIC,
          },
        });

        const tx = new Transaction({ initiator: wallet })
          .setTxInputs(keepRelevant(new Map(assetsToSend.map((x) => [x.unit, x.quantity])), await wallet.getUtxos()))
          .sendAssets({ address: recipientAddress }, assetsToSend);

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);

        await collection.doc(docId).update({ withdrawTx: txHash });

        return res.status(200).json({ txHash });
      }

      default: {
        res.setHeader('Allow', 'POST');
        return res.status(405).end();
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export default handler;
