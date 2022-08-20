import connectDB from '../../../../utils/mongo'
import Account from '../../../../models/Account'
import Wallet from '../../../../models/Wallet'
import getDiscordMember from '../../../../functions/getDiscordMember'
import getAssetsFromStakeKey from '../../../../functions/blockfrost/getAssetsFromStakeKey'
import { ADMIN_CODE } from '../../../../constants/api-keys'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'
import { DISCORD_ROLE_ID_OG } from '../../../../constants/discord'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { discordUserId, discordToken },
    } = req

    switch (method) {
      case 'HEAD': {
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

        // collect updated values for this account
        const userId = discordMember.user.id
        const username = `${discordMember.user.username}#${discordMember.user.discriminator}`
        const roles = { isOG: discordMember.roles?.includes(DISCORD_ROLE_ID_OG) }

        const account = await Account.findOne({
          userId,
        })

        if (!account) {
          return res.status(404).json({
            type: 'NOT_FOUND',
            message: `Account not found with user ID ${userId}`,
          })
        }

        account.username = username
        account.roles = roles

        await account.save()

        for (let i = 0; i < account.stakeKeys.length; i++) {
          const stakeKey = account.stakeKeys[i]
          console.log(`Syncing wallet with stake key ${stakeKey}`)

          const wallet = await Wallet.findOne({ stakeKey })

          if (wallet) {
            const assetIds = await getAssetsFromStakeKey(stakeKey, FOX_POLICY_ID)
            console.log(`Found ${assetIds.length} assets`)

            wallet.assets[FOX_POLICY_ID] = assetIds

            await wallet.save()
          }
        }

        return res.status(204).end()
      }

      default: {
        res.setHeader('Allow', 'HEAD')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
