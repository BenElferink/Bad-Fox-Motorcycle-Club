import connectDB from '../../../utils/mongo'
import Account from '../../../models/Account'
import getDiscordMember from '../../../functions/getDiscordMember'
import { DISCORD_ROLE_ID_OG } from '../../../constants/discord'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { discordUserId, discordToken },
    } = req

    if (!discordToken && !discordUserId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query param required: discordToken, discordUserId',
      })
    }

    if (!discordToken && admin_code !== ADMIN_CODE) {
      return res.status(401).json({
        type: 'UNAUTHORIZED',
        message: 'Admin code is invalid',
      })
    }

    const discordMember = await getDiscordMember(discordUserId, discordToken)

    if (!discordMember) {
      return res.status(404).json({
        type: 'MEMBER_ERROR',
        message: 'User is not in the Discord server',
      })
    }

    // collect updated values for this member
    const userId = discordMember.user.id
    const username = `${discordMember.user.username}#${discordMember.user.discriminator}`
    const roles = { isOG: discordMember.roles?.includes(DISCORD_ROLE_ID_OG) }

    switch (method) {
      case 'GET': {
        // find and update account in DB, or create one if new
        let account = await Account.findOne({
          userId,
        }).populate('portfolioWallets')

        if (!account) {
          account = new Account({
            userId,
            username,
            roles,
          })
        } else {
          account.username = username
          account.roles = roles
        }

        await account.save()

        return res.status(200).json(account)
      }

      case 'DELETE': {
        await Account.deleteOne({
          userId,
        })

        res.status(204).end()
        break
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
