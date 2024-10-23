import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { firestore } from '@/src/utils/firebase';
import type { Trade } from '@/src/@types';

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const collection = firestore.collection('trades');
        const { docs } = await collection.where('withdrawTx', '==', '').get();

        const now = Date.now();
        const needToWithdraw = docs
          .map((doc) => ({ ...(doc.data() as Trade), id: doc.id }))
          .filter(({ timestamp }) => timestamp && now - timestamp > 3 * 60 * 1000);

        for await (const { id } of needToWithdraw) {
          await axios.post('/api/trade', { docId: id });
        }

        return res.status(204).end();
      }

      default: {
        res.setHeader('Allow', 'GET');
        return res.status(405).end();
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export default handler;
