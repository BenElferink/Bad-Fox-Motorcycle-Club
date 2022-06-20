import mongoose from 'mongoose'

const MintAddress = new mongoose.Schema(
  {
    policyId: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    ogAddress: {
      type: mongoose.Schema.Types.String,
    },
    wlAddress: {
      type: mongoose.Schema.Types.String,
    },
    publicAddress: {
      type: mongoose.Schema.Types.String,
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

export default mongoose.models.MintAddress ?? mongoose.model('MintAddress', MintAddress)
