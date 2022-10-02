import connectDB from '../../../utils/mongo'
import MintAddress from '../../../models/MintAddress'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { policyId },
      body: { og, wl, pub },
    } = req

    if (!policyId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query params required: policyId',
      })
    }

    if (!isPolicyIdAllowed(policyId)) {
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

        let mint = await MintAddress.findOne({
          policyId,
        })

        if (mint) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: `Mint address already exists for Policy ID: ${policyId}`,
          })
        }

        mint = new MintAddress({
          policyId,
          og: {
            address: og?.address ?? 'None',
            amount: og?.amount ?? 0,
            price: og?.price ?? 0,
          },
          wl: {
            address: wl?.address ?? 'None',
            amount: wl?.amount ?? 0,
            price: wl?.price ?? 0,
          },
          pub: {
            address: pub?.address ?? 'None',
            amount: pub?.amount ?? 0,
            price: pub?.price ?? 0,
          },
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

        const mint = await MintAddress.findOne({
          policyId,
        })

        if (!mint) {
          return res.status(404).json({
            type: 'NOT_FOUND',
            message: `Mint address not found for Policy ID: ${policyId}`,
          })
        }

        mint.og = {
          address: og?.address ?? mint.og.address,
          amount: og?.amount ?? mint.og.amount,
          price: og?.price ?? mint.og.price,
        }

        mint.wl = {
          address: wl?.address ?? mint.wl.address,
          amount: wl?.amount ?? mint.wl.amount,
          price: wl?.price ?? mint.wl.price,
        }

        mint.pub = {
          address: pub?.address ?? mint.pub.address,
          amount: pub?.amount ?? mint.pub.amount,
          price: pub?.price ?? mint.pub.price,
        }

        await mint.save()

        return res.status(204).end()
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
