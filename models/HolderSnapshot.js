import mongoose from 'mongoose'

const HolderSnapshot = new mongoose.Schema(
  {
    policyId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: Date.now(),
    },
    totalAssetCount: Number,
    totalAdaPayout: Number,
    wallets: [
      {
        stakeKey: String,
        addresses: [String],
        assets: [String],
        payout: {
          adaForAssets: Number,
          adaForTraits: Number,
          totalAda: Number,
          totalLovelace: Number,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
)

export default mongoose.models.HolderSnapshot ?? mongoose.model('HolderSnapshot', HolderSnapshot)
