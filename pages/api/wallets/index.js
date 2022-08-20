import connectDB from '../../../utils/mongo'
import Wallet from '../../../models/Wallet'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      body,
    } = req

    switch (method) {
      case 'GET': {
        const wallets = await Wallet.find()

        return res.status(200).json({
          count: wallets.length,
          wallets,
        })
      }

      case 'POST': {
        if (admin_code !== ADMIN_CODE) {
          return res.status(401).json({
            type: 'UNAUTHORIZED',
            message: 'Admin code is invalid',
          })
        }

        const { policyId, stakeKey, addresses, assets } = body

        if (!policyId || !stakeKey || !addresses || !addresses?.length || !assets || !assets?.length) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message:
              'Please provide the following body: { policyId: "", stakeKey: "", addresses: [""], assets: [""] }',
          })
        }

        let wallet = await Wallet.findOne({ stakeKey })

        if (wallet) {
          wallet.addresses = [...wallet.addresses, ...addresses.filter((str) => !wallet.addresses.includes(str))]
          wallet.assets = {
            ...wallet.assets,
            [policyId]: assets,
          }
        } else {
          wallet = new Wallet({
            stakeKey,
            addresses,
            assets: {
              [policyId]: assets,
            },
          })

          await wallet.save()
        }

        return res.status(201).json({})
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'POST')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
