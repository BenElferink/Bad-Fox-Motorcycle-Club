import mongoose from 'mongoose'

const Floor = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    default: null,
  },
  timestamp: {
    type: mongoose.Schema.Types.Number,
    default: Date.now(),
  },
})

export default mongoose.models.Floor ?? mongoose.model('Floor', Floor)
