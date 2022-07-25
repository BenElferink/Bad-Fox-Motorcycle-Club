import mongoose from 'mongoose'
import { FOX_POLICY_ID } from '../constants/policy-ids'

const Wallet = new mongoose.Schema(
  {
    stakeKey: {
      type: mongoose.Schema.Types.String,
    },
    assets: {
      [FOX_POLICY_ID]: [
        {
          type: mongoose.Schema.Types.String,
        },
      ],
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
