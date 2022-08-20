import connectDB from '../../../../utils/mongo'
import Account from '../../../../models/Account'
import getDiscordMember from '../../../../functions/getDiscordMember'
import getStakeKeyFromWalletAddress from '../../../../functions/blockfrost/getStakeKeyFromWalletAddress'
import { ADMIN_CODE } from '../../../../constants/api-keys'
import { DISCORD_ROLE_ID_OG } from '../../../../constants/discord'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { discordUserId, discordToken, walletAddress },
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

    if (!walletAddress) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Body param required: walletAddress',
      })
    }

    if (walletAddress.indexOf('addr1') !== 0) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Please provide a valid wallet address (starts with addr1)',
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

    switch (method) {
      case 'POST': {
        let stakeKey = ''

        try {
          stakeKey = await getStakeKeyFromWalletAddress(walletAddress)
        } catch (error) {
          console.error(error.message)

          let c = 500
          let e = {}

          if (error?.response?.status == 403) {
            c = 403
            e = {
              type: 'WALLET_ERROR',
              message: 'Blockfrost API key maxed out',
            }
          } else {
            c = 404
            e = {
              type: 'WALLET_ERROR',
              message: 'Could not retrieve stake key',
            }
          }

          return res.status(c).json(e)
        }

        // verify that the stake key is not a duplicate
        const foundStakeKey = await Account.findOne({
          'mintWallet.stakeKey': stakeKey,
        })

        if (foundStakeKey) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: `This stake key is already registered by ${foundStakeKey.username}`,
          })
        }

        // find and update account in DB
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
        account.mintWallet = {
          stakeKey,
          address: walletAddress,
        }

        await account.save()

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
