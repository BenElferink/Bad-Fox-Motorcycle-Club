import axios from 'axios'
import connectDB from '../../../utils/mongo'
import POLICY_IDS from '../../../constants/policy-ids'
import { CNFT_TOOLS_API } from '../../../constants/api-urls'

export default async (req, res) => {
  try {
    await connectDB()

    const {
      method,
      query: { policyId },
    } = req

    if (!policyId) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: 'Query params required: policyId',
      })
    }

    if (!Object.values(POLICY_IDS).includes(policyId)) {
      return res.status(400).json({
        type: 'BAD_REQUEST',
        message: `This policy ID is not allowed: ${policyId}`,
      })
    }

    switch (method) {
      case 'GET': {
        const { data } = await axios.get(`${CNFT_TOOLS_API}/external/${policyId}`)

        const BAD_FOX_STAKE_KEY = 'stake1u9x8umwq2y32sh55h2ym8kxal0d9r94vfd75uh7q5me7y6g4nc2q3'
        const stakeKeys = {}

        data.forEach((obj) => {
          if (obj.ownerStakeKey && obj.ownerStakeKey !== BAD_FOX_STAKE_KEY) {
            if (stakeKeys[obj.ownerStakeKey]) {
              stakeKeys[obj.ownerStakeKey] += 1
            } else {
              stakeKeys[obj.ownerStakeKey] = 1
            }
          }
        })

        return res.status(200).json(
          Object.entries(stakeKeys)
            .map(([key, count]) => ({
              stakeKey: key,
              count,
            }))
            .sort((a, b) => b.count - a.count)
        )
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
