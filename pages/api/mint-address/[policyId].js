import connectDB from '../../../utils/mongo'
import MintAddress from '../../../models/MintAddress'
import POLICY_IDS from '../../../constants/policy-ids'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId },
      body: { ogAddress = '', wlAddress = '', publicAddress = '' },
    } = req

    if (!policyId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query params required: policyId',
      })
    }

    if (!Object.values(POLICY_IDS).includes(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        const mint = await MintAddress.findOne({
          policyId,
        })

        if (!mint) {
          return res.status(404).json({
            type: 'NOT_FOUND',
            message: `Mint address not found for Policy ID: ${policyId}`,
          })
        }

        return res.status(200).json(mint)
      }

      case 'POST': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        let mint = await MintAddress.findOne({ policyId })

        if (mint) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: `Mint address already exists for Policy ID: ${policyId}`,
          })
        }

        mint = new MintAddress({
          policyId,
          ogAddress,
          wlAddress,
          publicAddress,
        })

        await mint.save()

        return res.status(201).json(mint)
      }

      case 'PATCH': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        const mint = await MintAddress.findOne({ policyId })

        if (!mint) {
          return res.status(404).json({
            type: 'NOT_FOUND',
            message: `Mint address not found for Policy ID: ${policyId}`,
          })
        }

        mint.ogAddress = ogAddress ?? mint.ogAddress
        mint.wlAddress = wlAddress ?? mint.wlAddress
        mint.publicAddress = publicAddress ?? mint.publicAddress

        await mint.save()

        return res.status(204).json({})
      }

      default: {
        return res.status(404).json({
          type: 'NOT_FOUND',
          message: 'Method does not exist for this route',
        })
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
