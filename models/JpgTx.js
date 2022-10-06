import mongoose from 'mongoose'

const JpgTx = new mongoose.Schema(
  {
    timestamp: {
      type: mongoose.Schema.Types.Number,
    },
    txHash: {
      type: mongoose.Schema.Types.String,
    },
    policyId: {
      type: mongoose.Schema.Types.String,
    },
    assetId: {
      type: mongoose.Schema.Types.String,
    },
    boughtByAddress: {
      type: mongoose.Schema.Types.String,
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

export default mongoose.models.JpgTx ?? mongoose.model('JpgTx', JpgTx)
