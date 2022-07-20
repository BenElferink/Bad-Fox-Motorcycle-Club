import connectDB from '../../../utils/mongo'
import DiscordMember from '../../../models/DiscordMember'
import { DISCORD_ROLE_ID_OG } from '../../../constants/discord'
import getStakeKeyFromWalletAddress from '../../../functions/blockfrost/getStakeKeyFromWalletAddress'
import getDiscordMember from '../../../functions/getDiscordMember'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { discordUserId, discordToken },
      body,
    } = req

    if (!discordUserId && !discordToken) {
      return res
        .status(400)
        .json({ type: 'BAD_REQUEST', message: 'Query param required: discordUserId, discordToken' })
    }

    const discordMember = await getDiscordMember(discordUserId, discordToken)

    if (!discordMember) {
      return res.status(404).json({ type: 'MEMBER_ERROR', message: 'User is not in the Discord server' })
    }

    // collect updated values for this member
    const userId = discordMember.user.id
    const username = `${discordMember.user.username}#${discordMember.user.discriminator}`
    const roles = {
      isOG: discordMember.role?.includes(DISCORD_ROLE_ID_OG),
    }

    switch (method) {
      case 'GET': {
        // find and update member in DB, or create one if new
        let member = await DiscordMember.findOne({ userId })

        if (!member) {
          member = new DiscordMember({
            userId,
            username,
            roles,
          })
        } else {
          member.username = username
          member.roles = roles
        }

        await member.save()

        return res.status(200).json(member)
      }

      case 'PATCH': {
        const { walletAddress } = body

        if (!walletAddress) {
          return res.status(400).json({ type: 'BAD_REQUEST', message: 'Body param required: walletAddress' })
        } else if (walletAddress.indexOf('addr1') !== 0) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: 'Please provide a valid wallet address (starts with addr1)',
          })
        }

        let stakeKey = ''

        try {
          stakeKey = await getStakeKeyFromWalletAddress(walletAddress)
        } catch (error) {
          return res.status(404).json({ type: 'WALLET_ERROR', message: 'Could not retrieve stake key' })
        }

        // verify that the stake key is not a duplicate
        const foundStakeKey = await DiscordMember.findOne({ 'wallet.stakeKey': stakeKey })

        if (foundStakeKey) {
          return res.status(400).json({
            type: 'BAD_REQUEST',
            message: `This stake key is already registered by ${foundStakeKey.username}`,
          })
        }

        const wallet = {
          address: walletAddress,
          stakeKey,
        }

        // find and update member in DB, or create one if new
        let member = await DiscordMember.findOne({ userId })

        if (!member) {
          member = new DiscordMember({
            userId,
            username,
            roles,
            wallet,
          })
        } else {
          member.username = username
          member.roles = roles
          member.wallet = wallet
        }

        await member.save()

        return res.status(200).json(member)
      }

      default: {
        return res.status(404).json({})
      }
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({})
  }
}
