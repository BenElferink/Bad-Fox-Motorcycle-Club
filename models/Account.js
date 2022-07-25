import mongoose from 'mongoose'
import { FOX_POLICY_ID } from '../constants/policy-ids'

const Account = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    username: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    roles: {
      isOG: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
      },
    },
    mintWallet: {
      stakeKey: {
        type: mongoose.Schema.Types.String,
        default: '',
      },
      address: {
        type: mongoose.Schema.Types.String,
        default: '',
      },
    },
    portfolioWallets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
      },
    ],
  },
  {
    timestamps: true,
    // this creates and maintains:
    // {
    //   createdAt: Date,
    //   updatedAt: Date,
    // }
  }
)

export default mongoose.models.Account ?? mongoose.model('Account', Account)
