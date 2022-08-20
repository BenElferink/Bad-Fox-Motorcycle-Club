const mongoose = require('mongoose')
const { FOX_POLICY_ID } = require('../constants/policy-ids')

const Wallet = new mongoose.Schema(
  {
    stakeKey: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    addresses: [mongoose.Schema.Types.String],
    assets: {
      [FOX_POLICY_ID]: [mongoose.Schema.Types.String],
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

module.exports = mongoose.models.Wallet ?? mongoose.model('Wallet', Wallet)
