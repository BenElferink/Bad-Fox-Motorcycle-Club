const axios = require('axios')
const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID } = require('../constants/discord')

const getDiscordMember = async (discordUserId, discordUserToken) => {
  let userId = discordUserId

  if (!userId) {
    if (!discordUserToken) {
      throw new Error('getDiscordMember() is missing required paramaters')
    }

    // get user ID using an access token

    try {
      console.log('Fetching Discord profile')
      const { data } = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${discordUserToken}`,
        },
      })

      userId = data.id
    } catch (error) {
      console.error(error)

      return null
    }
  }

  // get userId using an user ID

  try {
    console.log('Fetching Discord guild member')
    const { data } = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: {
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })

    return data
  } catch (error) {
    if (error.isAxiosError && error.response?.status === 404) {
      console.error('Member not in server')

      return null
    } else {
      console.log('Error getting Discord profile')
      return await getDiscordMember(userId, discordUserToken)
    }
  }
}

module.exports = getDiscordMember
