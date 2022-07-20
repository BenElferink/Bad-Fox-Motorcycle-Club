import mongoose from 'mongoose'

const DiscordMember = new mongoose.Schema(
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
    wallet: {
      address: {
        type: mongoose.Schema.Types.String,
        default: '',
      },
      stakeKey: {
        type: mongoose.Schema.Types.String,
        default: '',
      },
    },
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

export default mongoose.models.DiscordMember ?? mongoose.model('DiscordMember', DiscordMember)
