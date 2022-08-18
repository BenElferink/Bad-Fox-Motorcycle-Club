import mongoose from 'mongoose'

const FloorSnapshot = new mongoose.Schema(
  {
    policyId: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    timestamp: {
      type: mongoose.Schema.Types.Number,
      default: Date.now(),
    },
    attributes: {
      type: mongoose.Schema.Types.Object,
      // [CategoryName]: {
      //   [TraitName]: Number | null,
      // },
      // ...
    },
  },
  {
    versionKey: false,
  }
)

export default mongoose.models.FloorSnapshot ?? mongoose.model('FloorSnapshot', FloorSnapshot)
