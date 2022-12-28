import { NextApiRequest, NextApiResponse } from 'next'
import { firebase, firestore } from '../../../utils/firebase'

type Response =
  | {
      sessionId: string
    }
  | {
      count: number
      items: firebase.firestore.DocumentData[]
    }

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const { method, query, body } = req

  const {
    snapshotStarted,
    snapshotDone,
    payoutStarted,
    payoutDone,
    receiptStarted,
    receiptDone,
    txError,
    settings,
  } = body
  const sessionId = query.sessionId
  const collection = firestore.collection('bad-drop')

  try {
    switch (method) {
      case 'POST': {
        const newDoc = await collection.add({
          timestamp: Date.now(),
          snapshotStarted,
          snapshotDone,
          payoutStarted,
          payoutDone,
          receiptStarted,
          receiptDone,
          txError,
          settings,
        })

        return res.status(201).json({
          sessionId: newDoc.id,
        })
      }

      case 'PATCH': {
        if (!sessionId || typeof sessionId !== 'string') {
          return res.status(400).end('Query params required (sessionId: string)')
        }

        await collection.doc(sessionId).update({
          snapshotStarted,
          snapshotDone,
          payoutStarted,
          payoutDone,
          receiptStarted,
          receiptDone,
          txError,
          settings,
        })

        return res.status(201).json({
          sessionId,
        })
      }

      case 'GET': {
        const collectionQuery = await collection.orderBy('timestamp', 'asc').get()
        const docs = collectionQuery.docs.map((doc) => doc.data())

        return res.status(200).json({
          count: docs.length,
          items: docs,
        })
      }

      default: {
        res.setHeader('Allow', 'POST')
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
