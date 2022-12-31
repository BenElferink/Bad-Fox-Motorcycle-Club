import { NextApiRequest, NextApiResponse } from 'next'
import { TOOLS_PROD_CODE } from '../../../constants'
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
  const { method, headers, query, body = {} } = req

  const toolsProdCode = headers.tools_prod_code
  const sessionId = query.sessionId
  const toolName = query.tool_name as string
  const collection = firestore.collection(`tools/${toolName}/sessions`)

  try {
    switch (method) {
      case 'POST': {
        if (toolsProdCode !== TOOLS_PROD_CODE) {
          return res.status(401).end()
        }

        const newDoc = await collection.add({
          timestamp: Date.now(),
          ...body,
        })

        return res.status(201).json({
          sessionId: newDoc.id,
        })
      }

      case 'PATCH': {
        if (toolsProdCode !== TOOLS_PROD_CODE) {
          return res.status(401).end()
        }

        if (!sessionId || typeof sessionId !== 'string') {
          return res.status(400).end()
        }

        await collection.doc(sessionId).update(body)

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
        res.setHeader('Allow', 'PATCH')
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
