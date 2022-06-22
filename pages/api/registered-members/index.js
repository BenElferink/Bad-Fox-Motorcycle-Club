import connectDB from '../../../utils/mongo'
import DiscordMember from '../../../models/DiscordMember'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { adminCode },
    } = req

    if (adminCode !== ADMIN_CODE) {
      return res.status(401).json({ type: 'UNAUTHORIZED', message: 'Admin code is invalid' })
    }

    switch (method) {
      case 'GET': {
        const count = await DiscordMember.countDocuments({})
        const members = await DiscordMember.find({})

        res.status(200).json({ count, members })
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
