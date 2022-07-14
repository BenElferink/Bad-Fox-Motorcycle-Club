import axios from 'axios'
import connectDB from '../../../utils/mongo'
import DiscordMember from '../../../models/DiscordMember'
import {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  DISCORD_ROLE_ID_OG,
  DISCORD_ROLE_ID_WL,
} from '../../../constants/discord'
import getStakeKeyFromWalletAddress from '../../../functions/blockfrost/getStakeKeyFromWalletAddress'
import { ADMIN_CODE } from '../../../constants/api-keys'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { adminCode },
      body: { userId, walletAddress },
    } = req

    if (adminCode !== ADMIN_CODE) {
      return res.status(401).json({ type: 'UNAUTHORIZED', message: 'Admin code is invalid' })
    }

    let memberData = {}

    try {
      // get guild member using userId
      const { data } = await axios.get(
        `https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`,
        {
          headers: {
            authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        }
      )

      memberData = data
    } catch (error) {
      console.error(error)

      if (error.isAxiosError && error.response.status === 404) {
        return res.status(404).json({ type: 'MEMBER_ERROR', message: 'User is not in the Discord server' })
      }

      return res.status(500).json({})
    }

    // collect updated values for this member
    const username = `${memberData.user.username}#${memberData.user.discriminator}`
    const roles = {
      isOG: memberData.roles?.includes(DISCORD_ROLE_ID_OG),
      isWL: memberData.roles?.includes(DISCORD_ROLE_ID_WL),
    }

    switch (method) {
      case 'PATCH': {
        if (!walletAddress) {
          return res.status(400).json({ type: 'BAD_REQUEST', message: 'Body param required: walletAddress' })
        } else if (walletAddress.indexOf('addr1') !== 0) {
          return res
            .status(400)
            .json({
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
    res.status(500).json({})
  }
}
