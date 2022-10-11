import connectDB from '../../../utils/mongo'
import Account from '../../../models/Account'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
    } = req

    if (admin_code !== ADMIN_CODE) {
      return res.status(401).json({
        type: 'UNAUTHORIZED',
        message: 'Admin code is invalid',
      })
    }

    switch (method) {
      case 'GET': {
        const filters = {}

        const count = await Account.countDocuments(filters)
        const accounts = await Account.find(filters)

        return res.status(200).json({
          count,
          accounts,
        })
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
