import connectDB from '../../../../utils/mongo'
import { blockfrost } from '../../../../utils/blockfrost'
import Account from '../../../../models/Account'
import Wallet from '../../../../models/Wallet'
import getDiscordMember from '../../../../functions/getDiscordMember'
import { ADMIN_CODE } from '../../../../constants/api-keys'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'
import { DISCORD_ROLE_ID_OG } from '../../../../constants/discord'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      headers: { admin_code },
      query: { discordUserId, discordToken, addressOrKey },
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

    const stakeKey = addressOrKey.indexOf('stake1') === 0 ? addressOrKey : null
    const walletAddress = addressOrKey.indexOf('addr1') === 0 ? addressOrKey : null

    if (!stakeKey && !walletAddress) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Please provide a valid wallet address or stake key',
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

    const account = await Account.findOne({
      userId,
    })

    if (!account) {
      return res.status(404).json({
        type: 'NOT_FOUND',
        message: `Account not found with user ID ${userId}`,
      })
    }

    let finalStakeKey = stakeKey || ''

    if (!finalStakeKey) {
      try {
        finalStakeKey = await blockfrost.getStakeKeyWithWalletAddress(walletAddress)
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
    }

    switch (method) {
      case 'POST': {
        const wallet = await Wallet.findOne({ stakeKey: finalStakeKey })

        if (!wallet) {
          const assets = await blockfrost.getAssetIdsWithStakeKey(finalStakeKey, FOX_POLICY_ID)
          const addresses = await blockfrost.getWalletAddressesWithStakeKey(finalStakeKey)

          const newWallet = new Wallet({
            stakeKey: finalStakeKey,
            addresses,
            assets: {
              [FOX_POLICY_ID]: assets,
            },
          })

          await newWallet.save()
        }

        account.username = username
        account.roles = roles
        if (!account.stakeKeys.find((str) => str === finalStakeKey)) {
          account.stakeKeys.push(finalStakeKey)
        }

        await account.save()

        return res.status(204).end()
      }

      case 'DELETE': {
        account.username = username
        account.roles = roles
        account.stakeKeys = account.stakeKeys.filter((str) => str !== finalStakeKey)

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
