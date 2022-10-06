import mongoose from 'mongoose'

const Setting = new mongoose.Schema(
  {
    policyId: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    submitTx: {
      startDate: {
        type: mongoose.Schema.Types.Date,
        default: new Date(2022, 8, 1),
      },
      endDate: {
        type: mongoose.Schema.Types.Date,
        default: new Date(2022, 8, 8),
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

export default mongoose.models.Setting ?? mongoose.model('Setting', Setting)
