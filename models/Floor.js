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
    required: true,
  },
  timestamp: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
})

export default mongoose.models.Floor ?? mongoose.model('Floor', Floor)
