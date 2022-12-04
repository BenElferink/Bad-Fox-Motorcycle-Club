import blockfrost from '../../../utils/blockfrost'
import { ROYALTY_WALLET } from '../../../constants'

const ONE_MILLION = 1000000

export default async (req, res) => {
  try {
    const { method } = req

    switch (method) {
      case 'GET': {
        const wallet = await blockfrost.getWalletWithWalletAddress(ROYALTY_WALLET)
        const balanceLovelace = Number(
          wallet.amount.find((item) => item.unit === 'lovelace')?.quantity || ONE_MILLION
        )

        // const openCnftResponse = await axios.get(`https://api.opencnft.io/1/policy/${BAD_FOX_POLICY_ID}`)
        // const volumeLovelace = Number(openCnftResponse.data?.total_volume || ONE_MILLION)

        return res.status(200).json({
          adaInWallet: balanceLovelace / ONE_MILLION,
        })
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
