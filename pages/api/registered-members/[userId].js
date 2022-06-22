import connectDB from '../../../utils/mongo'
import DiscordMember from '../../../models/DiscordMember'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { userId, adminCode },
    } = req

    if (adminCode !== ADMIN_CODE) {
      return res.status(401).json({ type: 'UNAUTHORIZED', message: 'Admin code is invalid' })
    }

    switch (method) {
      case 'GET': {
        const member = await DiscordMember.findOne({ userId })

        if (!member) {
          res.status(404).json({})
        }

        res.status(200).json({ member })
        break
      }

      case 'DELETE': {
        await DiscordMember.deleteOne({ userId })

        res.status(204).json()
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
