import axios from 'axios'
import { blockfrost } from '../../../../utils/blockfrost'
import { FOX_ROYALTY_WALLET } from '../../../../constants/addresses'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'
import { OPEN_CNFT_API } from '../../../../constants/api-urls'

const ONE_MILLION = 1000000

export default async (req, res) => {
  try {
    const { method } = req

    switch (method) {
      case 'GET': {
        const wallet = await blockfrost.getWalletWithWalletAddress(FOX_ROYALTY_WALLET)
        const balanceLovelace = Number(
          wallet.amount.find((item) => item.unit === 'lovelace')?.quantity || ONE_MILLION
        )

        const openCnftResponse = await axios.get(`${OPEN_CNFT_API}/policy/${FOX_POLICY_ID}`)
        const volumeLovelace = Number(openCnftResponse.data?.total_volume || ONE_MILLION)

        return res.status(200).json({
          adaInWallet: balanceLovelace / ONE_MILLION,
          adaInVolume: volumeLovelace / ONE_MILLION,
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
