module.exports = {
  DISCORD_GUILD_ID: '951826641695432734',
  DISCORD_BOT_TOKEN: process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN,
  DISCORD_REDIRECT_URL_REGISTER:
    process.env.NODE_ENV === 'development'
      ? 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fregister%2Fredirect&response_type=token&scope=identify'
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fregister%2Fredirect&response_type=token&scope=identify',
  DISCORD_ROLE_ID_OG: '957270960065609798',
  DISCORD_ROLE_ID_WL: '957270836220407818',
  DISCORD_ROLE_ID_PUBLIC_RESERVE: '969214730172514354',
}
