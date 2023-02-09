import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { ADMIN_CODE } from '../../../../constants'
import { firestore } from '../../../../utils/firebase'

export type SpaceTroopersResponse = {
  stakeKey: string
  active: boolean
}

const handler = async (req: NextApiRequest, res: NextApiResponse<SpaceTroopersResponse>) => {
  const { method, headers, query, body } = req

  const stakeKey = query.wallet_identifier as string
  const adminCode = headers.admin_code || query.admin_code

  if (method !== 'HEAD' && stakeKey.indexOf('stake1') !== 0) {
    return res.status(400).end()
  }

  try {
    switch (method) {
      case 'GET': {
        const collection = firestore.collection('space-troopers')
        const collectionQuery = await collection.where('stakeKey', '==', stakeKey).get()

        if (!collectionQuery.docs.length) {
          return res.status(200).json({
            stakeKey,
            active: false,
          })
        }

        const data = collectionQuery.docs[0].data() as SpaceTroopersResponse

        return res.status(200).json(data)
      }

      case 'PUT': {
        const active = Boolean(body.active)
        const walletAddress = body.walletAddress

        if (walletAddress.indexOf('addr1') !== 0) {
          return res.status(400).end()
        }

        const collection = firestore.collection('space-troopers')
        const collectionQuery = await collection.where('stakeKey', '==', stakeKey).get()

        if (!collectionQuery.docs.length) {
          await collection.add({
            stakeKey,
            walletAddress,
            active,
          })
        } else {
          const documentId = collectionQuery.docs[0].id
          await collection.doc(documentId).update({
            walletAddress,
            active,
          })
        }

        return res.status(201).end()
      }

      case 'HEAD': {
        if (adminCode !== ADMIN_CODE) {
          return res.status(401).end()
        }

        const collection = firestore.collection('space-troopers')
        const collectionQuery = await collection.where('active', '==', true).get()
        const collectionDocs = collectionQuery.docs.map((doc) => doc.data())

        await Promise.all(
          collectionDocs.map(({ walletAddress }) =>
            axios.post<{
              result: {
                numberJoined: number
              }
            }>('https://europe-west1-space-troopers-289a2.cloudfunctions.net/autoJoinSimple', {
              data: {
                address: walletAddress,
                customName: 'BadFoxMC',
                gameType: 'public',
                pingDiscord: true,
              },
            })
          )
        )

        return res.status(200).end()
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'PUT')
        res.setHeader('Allow', 'HEAD')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end('Internal Server Error')
  }
}

export default handler
