import mongoose from 'mongoose'

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

export default mongoose.models.Account ?? mongoose.model('Account', Account)
