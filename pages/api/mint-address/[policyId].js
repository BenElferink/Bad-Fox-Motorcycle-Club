import connectDB from '../../../utils/mongo'
import MintAddress from '../../../models/MintAddress'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { policyId, adminCode },
      body: { ogAddress = '', wlAddress = '', publicAddress = '' },
    } = req

    switch (method) {
      case 'GET': {
        const mint = await MintAddress.findOne({ policyId })

        if (!mint) {
          return res
            .status(404)
            .json({ type: 'NOT_FOUND', message: `Mint address not found for Policy ID: ${policyId}` })
        }

        res.status(200).json(mint)
        break
      }

      case 'POST': {
        if (adminCode !== ADMIN_CODE) {
          return res.status(401).json({ type: 'UNAUTHORIZED', message: 'Admin code is invalid' })
        }

        let mint = await MintAddress.findOne({ policyId })

        if (mint) {
          return res
            .status(400)
            .json({ type: 'BAD_REQUEST', message: `Mint address already exists for Policy ID: ${policyId}` })
        }

        mint = new MintAddress({
          policyId,
          ogAddress,
          wlAddress,
          publicAddress,
        })

        await mint.save()

        res.status(201).json(mint)

        break
      }

      case 'PATCH': {
        if (adminCode !== ADMIN_CODE) {
          return res.status(401).json({ type: 'UNAUTHORIZED', message: 'Admin code is invalid' })
        }

        const mint = await MintAddress.findOne({ policyId })

        if (!mint) {
          return res
            .status(404)
            .json({ type: 'NOT_FOUND', message: `Mint address not found for Policy ID: ${policyId}` })
        }

        mint.ogAddress = ogAddress ?? mint.ogAddress
        mint.wlAddress = wlAddress ?? mint.wlAddress
        mint.publicAddress = publicAddress ?? mint.publicAddress

        await mint.save()

        res.status(200).json(mint)
        break
      }

      default: {
        res.status(404).json({})
        break
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({})
  }
}
