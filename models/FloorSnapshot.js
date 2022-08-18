import mongoose from 'mongoose'

const FloorSnapshot = new mongoose.Schema(
  {
    policyId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: Date.now(),
    },
    attributes: {
      type: Object,
      // [CategoryName]: {
      //   [TraitName]: number | null,
      // },
      // ...
    },
  },
  {
    versionKey: false,
  }
)

export default mongoose.models.FloorSnapshot ?? mongoose.model('FloorSnapshot', FloorSnapshot)
