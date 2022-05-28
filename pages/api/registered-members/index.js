import connectDB from '../../../utils/mongo'
import DiscordMember from '../../../models/DiscordMember'

export default async (req, res) => {
  try {
    await connectDB()

    const { method } = req

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
