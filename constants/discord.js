// https://github.com/GregTCLTK/Discord-Api-Endpoints/blob/master/Endpoints.md

const DISCORD_DEV_TEST_REDIRECT_URL =
  'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord-dev-test-redirect&response_type=token&scope=identify'

module.exports = {
  DISCORD_GUILD_ID: '951826641695432734',
  DISCORD_ROLE_ID_OG: '957270960065609798',
  DISCORD_BOT_TOKEN: process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN,

  DISCORD_AUTH_URL_REGISTER_MINT_WALLET:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fmint%2Fregister-wallet%2Fredirect&response_type=token&scope=identify',

  DISCORD_AUTH_URL_CHECK_MINT_WALLET:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fmint%2Fcheck-wallet%2Fredirect&response_type=token&scope=identify',

  DISCORD_REDIRECT_URL_MINT:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fmint%2Fredirect&response_type=token&scope=identify',

  DISCORD_AUTH_URL_MANAGE_MY_WALLETS:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fwallet%2Fmanage%2Fredirect&response_type=token&scope=identify',

  DISCORD_AUTH_URL_MY_WALLET_ASSETS:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fwallet%2Fassets%2Fredirect&response_type=token&scope=identify',

  DISCORD_AUTH_URL_MY_WALLET_TRAITS:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fwallet%2Ftraits%2Fredirect&response_type=token&scope=identify',

  DISCORD_AUTH_URL_MY_WALLET_PORTFOLIO:
    process.env.NODE_ENV === 'development'
      ? DISCORD_DEV_TEST_REDIRECT_URL
      : 'https://discord.com/api/oauth2/authorize?client_id=967368512941203466&redirect_uri=https%3A%2F%2Fbadfoxmc.com%2Fwallet%2Fportfolio%2Fredirect&response_type=token&scope=identify',
}
