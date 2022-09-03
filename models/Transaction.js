import mongoose from 'mongoose'

const Transaction = new mongoose.Schema(
  {
    hash: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    timestamp: {
      type: mongoose.Schema.Types.Number,
    },
    asset: {
      type: mongoose.Schema.Types.String,
    },
    address: {
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

export default mongoose.models.Transaction ?? mongoose.model('Transaction', Transaction)
