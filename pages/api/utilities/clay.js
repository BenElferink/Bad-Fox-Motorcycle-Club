import connectDB from '../../../utils/mongo'
import Wallet from '../../../models/Wallet'
import { blockfrost } from '../../../utils/blockfrost'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import { TREASURY_WALLET } from '../../../constants/addresses'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import clayTraitSetsFile from '../../../data/clay-trait-sets'
// import traitsData from '../../../data/traits/bad-fox.json'

// const data = {
//   'Role Name': {
//     shares: 0,
//     possibilities: 0,
//     set: [
//       {
//         traitCategory: '',
//         traitLabel: '',
//         traitCount: 0,
//         traitPercent: '0.0%',
//         traitImage: '',
//       },
//     ],
//   },
// }

// Object.entries(data).forEach(([roleName, { set }]) => {
//   let possibilities = 0

//   set.forEach((obj, setIdx) => {
//     const traitName = obj.traitLabel
//     const foundTrait = traitsData[obj.traitCategory].find(({ onChainName }) => onChainName === traitName)

//     if (!foundTrait) {
//       console.warn('no trait', traitName)
//     } else {
//       if (setIdx === 0) {
//         data[roleName].shares = 0
//       }

//       data[roleName].shares += Math.round(10 / Number(foundTrait.percent.replace('%', '')))
//       data[roleName].set[setIdx] = {
//         ...obj,
//         traitCount: foundTrait.count,
//         traitPercent: foundTrait.percent,
//         traitImage: foundTrait.image,
//       }

//       if (foundTrait.count < possibilities || possibilities === 0) {
//         possibilities = foundTrait.count
//       }
//     }
//   })

//   data[roleName].possibilities = possibilities

//   totalShares += data[roleName].shares * data[roleName].possibilities
//   totalPossibilities += data[roleName].possibilities
// })

export default async (req, res) => {
  try {
    await connectDB()

    const { method } = req

    switch (method) {
      case 'GET': {
        const traitSets = {}
        const wallets = await Wallet.find()

        for (const wallet of wallets) {
          const assetsOfThisWallet = wallet.assets[BAD_FOX_POLICY_ID].map((assetId) =>
            getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets').find((asset) => asset.assetId === assetId)
          )

          for (const setName in clayTraitSetsFile) {
            const { shares, possibilities, set } = clayTraitSetsFile[setName]

            let ownsThisSet = true
            let leastHeldTrait = 0

            for (const setItem of set) {
              const { traitCategory, traitLabel } = setItem
              let ownedTraitCount = 0

              assetsOfThisWallet.forEach((asset) => {
                if (asset.attributes[traitCategory] === traitLabel) {
                  ownedTraitCount++
                }
              })

              if (ownedTraitCount === 0) {
                ownsThisSet = false
              }

              if (ownedTraitCount < leastHeldTrait || leastHeldTrait === 0) {
                leastHeldTrait = ownedTraitCount
              }
            }

            const ownedCount = ownsThisSet ? leastHeldTrait : 0

            if (!traitSets[setName]) {
              traitSets[setName] = {
                shares,
                tokens: 0,
                possibilities,
                occupied: 0,
                set,
                wallets: [],
              }
            }

            if (ownedCount) {
              traitSets[setName].occupied += ownedCount
              traitSets[setName].wallets.push({
                stakeKey: wallet.stakeKey,
                owned: ownedCount,
              })
            }
          }
        }

        const badFoxWallet = await blockfrost.getWalletWithWalletAddress(TREASURY_WALLET)
        const clayBalance =
          Number(
            badFoxWallet.amount.find(
              (item) => item.unit === '38ad9dc3aec6a2f38e220142b9aa6ade63ebe71f65e7cc2b7d8a8535434c4159'
            )?.quantity || 10000
          ) / 10000

        let maxShares = 0
        let ownedShares = 0
        let maxPossibilities = 0
        let ownedPossibilities = 0

        Object.values(traitSets).forEach(({ shares, possibilities, wallets }) => {
          maxShares += shares * possibilities
          maxPossibilities += possibilities

          wallets.forEach(({ owned }) => {
            ownedShares += owned * shares
            ownedPossibilities += owned
          })
        })

        const tokensPerShare = clayBalance / ownedShares

        Object.entries(traitSets).forEach(([setName, { shares }]) => {
          traitSets[setName].tokens = tokensPerShare * shares
        })

        return res.status(200).json({
          clayBalance,
          tokensPerShare,
          maxShares,
          ownedShares,
          maxPossibilities,
          ownedPossibilities,
          traitSets,
        })
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
      }
    }
  } catch (error) {
    console.error(error.message)

    return res.status(500).json({})
  }
}
