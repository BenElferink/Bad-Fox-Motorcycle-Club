require('dotenv').config()
const axios = require('axios')
const { ADMIN_CODE } = require('../constants/api-keys')
const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_ROLE_ID_OG, DISCORD_ROLE_ID_WL } = require('../constants/discord')

const URL = 'http://localhost:3000' // 'https://badfoxmc.com'

const getDiscordProfile = async (userId) => {
  try {
    const { data } = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: {
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })

    return data
  } catch (error) {
    return await getDiscordProfile(userId)
  }
}

const deleteMember = async (userId) => {
  try {
    await axios.delete(`${URL}/api/registered-members/${userId}?adminCode=${ADMIN_CODE}`)
  } catch (error) {
    console.error(error)
  }
}

const run = async () => {
  try {
    const { data } = await axios.get(`${URL}/api/registered-members?adminCode=${ADMIN_CODE}`)

    for (const registeredMember of data.members) {
      try {
        // get guild member using userId
        const discordMember = await getDiscordProfile(registeredMember.userId)
        const isOG = discordMember.roles?.includes(DISCORD_ROLE_ID_OG)
        const isWL = discordMember.roles?.includes(DISCORD_ROLE_ID_WL)

        if (isOG && isWL) {
          console.error('has both roles -', registeredMember.username, registeredMember.userId)
        }

        if ((!isOG && !isWL) || !registeredMember.wallet?.address) {
          if (!isOG && !isWL) {
            console.error(registeredMember.username, '- has no mint roles')
          } else {
            console.error(registeredMember.username, '- did not submit address')
          }

          await deleteMember(registeredMember.userId)
        }
      } catch (error) {
        if (error.isAxiosError && error.response?.status === 404) {
          console.error(registeredMember.username, '- not in server')

          await deleteMember(registeredMember.userId)
        } else {
          console.error(error)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

run()
