import axios from 'axios'
import connectDB from '../../utils/mongo'
import DiscordMember from '../../models/DiscordMember'
import { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_ROLE_ID_OG, DISCORD_ROLE_ID_PUBLIC_RESERVE, DISCORD_ROLE_ID_WL } from '../../constants/discord'
import getStakeKeyFromWalletAddress from '../../functions/blockfrost/getStakeKeyFromWalletAddress'

export default async (req, res) => {
  try {
    await connectDB()

    const { method, query, body } = req

    if (!query.token) {
      return res.status(400).json({ message: 'Query param required: token' })
    }

    // get userId using an access token
    const { data: userData } = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${query.token}`,
      },
    })

    const userId = userData.id

    // get guild member using userId
    const { data: memberData } = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: {
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })

    // collect updated values for this member
    const username = `${memberData.user.username}#${memberData.user.discriminator}`
    const roles = {
      isOG: memberData.roles.includes(DISCORD_ROLE_ID_OG),
      isWL: memberData.roles.includes(DISCORD_ROLE_ID_WL),
      isPublicReserve: memberData.roles.includes(DISCORD_ROLE_ID_PUBLIC_RESERVE),
    }

    switch (method) {
      case 'GET': {
        // find and update member in DB, or create one if new
        let member = await DiscordMember.findOne({
          userId,
        })

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

        res.status(200).json(member)
        break
      }

      case 'PATCH': {
        const { walletAddress } = body

        if (!walletAddress) {
          return res.status(400).json({ message: 'Body param required: walletAddress' })
        } else if (walletAddress.indexOf('addr1') !== 0) {
          return res.status(400).json({ message: 'Please provide a valid wallet address (starts with addr1)' })
        }

        let stakeKey = ''

        try {
          stakeKey = await getStakeKeyFromWalletAddress(walletAddress)
        } catch (error) {}

        const wallet = {
          address: walletAddress,
          stakeKey,
        }

        // find and update member in DB, or create one if new
        let member = await DiscordMember.findOne({
          userId,
        })

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

        res.status(200).json(member)
        break
      }

      default: {
        res.status(404).json({})
        break
      }
    }
  } catch (error) {
    console.error(error)

    if (error.isAxiosError && error.response.status === 404) {
      return res.status(404).json({ message: 'User is not in the "Bad Fox MC" Discord server' })
    }

    res.status(500).json({})
  }
}
