import blockfrost from '../../../utils/blockfrost'

export default async (req, res) => {
  try {
    const {
      method,
      query: { txHash },
    } = req

    switch (method) {
      case 'GET': {
        if (!txHash || typeof txHash !== 'string') {
          return res.status(400).end('Bad Request')
        }

        console.log('Fetching TX information with TX Hash:', txHash)

        await blockfrost.txs(txHash)

        const payload = {
          txHash,
          submitted: true,
        }

        console.log('Fetched TX information:', payload)

        return res.status(200).json(payload)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    if (error?.status_code === 404 || error?.message === 'The requested component has not been found.') {
      return res.status(200).json({
        txHash,
        submitted: false,
      })
    }

    return res.status(500).json({})
  }
}
