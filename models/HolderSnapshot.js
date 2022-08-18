import mongoose from 'mongoose'

const HolderSnapshot = new mongoose.Schema(
  {
    policyId: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    timestamp: {
      type: mongoose.Schema.Types.Number,
      default: Date.now(),
    },
    totalAssetCount: mongoose.Schema.Types.Number,
    totalAdaPayout: mongoose.Schema.Types.Number,
    wallets: [
      {
        stakeKey: mongoose.Schema.Types.String,
        addresses: [mongoose.Schema.Types.String],
        assets: [mongoose.Schema.Types.String],
        payout: {
          adaForAssets: mongoose.Schema.Types.Number,
          adaForTraits: mongoose.Schema.Types.Number,
          totalAda: mongoose.Schema.Types.Number,
          totalLovelace: mongoose.Schema.Types.Number,
        },
      },
    ],
  },
  {
    versionKey: false,
  }
)

export default mongoose.models.HolderSnapshot ?? mongoose.model('HolderSnapshot', HolderSnapshot)
