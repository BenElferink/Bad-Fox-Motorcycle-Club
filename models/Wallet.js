import mongoose from 'mongoose'
import { BAD_FOX_POLICY_ID } from '../constants/policy-ids'

const Wallet = new mongoose.Schema(
  {
    stakeKey: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    addresses: [mongoose.Schema.Types.String],
    assets: {
      [BAD_FOX_POLICY_ID]: [mongoose.Schema.Types.String],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    // this creates and maintains:
    // {
    //   createdAt: Date,
    //   updatedAt: Date,
    // }
  }
)

export default mongoose.models.Wallet ?? mongoose.model('Wallet', Wallet)
