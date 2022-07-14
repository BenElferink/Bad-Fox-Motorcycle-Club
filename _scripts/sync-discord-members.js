require('dotenv').config()
const axios = require('axios')
const { ADMIN_CODE } = require('../constants/api-keys')
const {
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  DISCORD_ROLE_ID_OG,
  DISCORD_ROLE_ID_WL,
} = require('../constants/discord')

const URL = 'http://localhost:3000' // 'https://badfoxmc.com'

const deleteMember = async (userId) => {
  try {
    console.log('Deleting registered member')
    await axios.delete(`${URL}/api/registered-members/${userId}?adminCode=${ADMIN_CODE}`)
  } catch (error) {
    console.log('Error deleting registered member')
  }
}

const getDiscordProfile = async (userId) => {
  try {
    console.log('Getting Discord profile')
    const { data } = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: {
        authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })

    return data
  } catch (error) {
    if (error.isAxiosError && error.response?.status === 404) {
      console.error('Member not in server')
      await deleteMember(userId)
      return null
    } else {
      console.log('Error getting Discord profile')
      return await getDiscordProfile(userId)
    }
  }
}

const run = async () => {
  try {
    const { data } = await axios.get(`${URL}/api/registered-members?adminCode=${ADMIN_CODE}`)

    for (const registeredMember of data.members) {
      console.log('\nSyncing:', registeredMember.username, registeredMember.userId)
      const discordMember = await getDiscordProfile(registeredMember.userId)

      if (discordMember) {
        const isOG = discordMember.roles?.includes(DISCORD_ROLE_ID_OG)
        const isWL = discordMember.roles?.includes(DISCORD_ROLE_ID_WL)

        if (isOG && isWL) {
          console.error('Member has both roles')
        }

        if (!isOG && !isWL) {
          console.error('Member has no mint roles')
          await deleteMember(registeredMember.userId)
        } else if (!registeredMember.wallet?.address) {
          console.error('Member did not submit address')
          await deleteMember(registeredMember.userId)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

run()
