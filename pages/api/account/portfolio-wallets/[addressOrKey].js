import connectDB from '../../../../utils/mongo'
import Account from '../../../../models/Account'
import Wallet from '../../../../models/Wallet'
import getDiscordMember from '../../../../functions/getDiscordMember'
import getStakeKeyFromWalletAddress from '../../../../functions/blockfrost/getStakeKeyFromWalletAddress'
import getAssetsFromStakeKey from '../../../../functions/blockfrost/getAssetsFromStakeKey'
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
        finalStakeKey = await getStakeKeyFromWalletAddress(walletAddress)
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
        let wallet = await Wallet.findOne({
          stakeKey: finalStakeKey,
        })

        const assets = await getAssetsFromStakeKey(finalStakeKey, FOX_POLICY_ID)

        if (!wallet) {
          wallet = new Wallet({
            stakeKey: finalStakeKey,
            assets: {
              [FOX_POLICY_ID]: assets,
            },
          })
        } else {
          wallet.assets[FOX_POLICY_ID] = assets
        }

        await wallet.save()

        account.username = username
        account.roles = roles
        if (!account.portfolioWallets.find((str) => str === wallet._id)) {
          account.portfolioWallets.push(wallet._id)
        }

        await account.save()

        return res.status(204).json({})
      }

      case 'DELETE': {
        const wallet = await Wallet.findOne({
          stakeKey: finalStakeKey,
        })

        if (!wallet) {
          return res.status(404).json({
            type: 'BAD_REQUEST',
            message: `Could not find wallet with stake key ${finalStakeKey}`,
          })
        }

        account.username = username
        account.roles = roles
        account.portfolioWallets = account.portfolioWallets.filter((str) => str !== wallet._id)

        await account.save()

        return res.status(204).json({})
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
