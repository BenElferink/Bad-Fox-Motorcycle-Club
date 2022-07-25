import mongoose from 'mongoose'

const addressObject = {
  address: {
    type: mongoose.Schema.Types.String,
    default: 'None',
  },
  amount: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
}

const MintAddress = new mongoose.Schema(
  {
    policyId: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    og: addressObject,
    wl: addressObject,
    pub: addressObject,
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

export default mongoose.models.MintAddress ?? mongoose.model('MintAddress', MintAddress)
