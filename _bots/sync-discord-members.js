require('dotenv').config()
const axios = require('axios')
const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_ROLE_ID_OG, DISCORD_ROLE_ID_WL } = require('../constants/discord')

// Don't forget to un-comment the DELETE method in /pages/api/registered-members/[userId].js
const URL = 'http://localhost:3000' // 'https://badfoxmc.com'

const run = async () => {
  try {
    const { data } = await axios.get(URL + '/api/registered-members')

    for (const registeredMember of data.members) {
      try {
        // get guild member using userId
        const { data: discordMember } = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${registeredMember.userId}`, {
          headers: {
            authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        })

        const isOG = discordMember.roles?.includes(DISCORD_ROLE_ID_OG)
        const isWL = discordMember.roles?.includes(DISCORD_ROLE_ID_WL)

        if (isOG && isWL) {
          console.error('has both roles -', registeredMember.username, registeredMember.userId)
        }

        if (!isOG && !isWL) {
          try {
            await axios.delete(URL + '/api/registered-members/' + registeredMember.userId)
          } catch (error) {
            console.error(error)
          }
        }
      } catch (error) {
        if (error.isAxiosError && error.response.status === 404) {
          console.error(registeredMember.username, '- not in server')

          try {
            await axios.delete(URL + '/api/registered-members/' + registeredMember.userId)
          } catch (error) {
            console.error(error)
          }
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
