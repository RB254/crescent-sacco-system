const mongoose = require('mongoose');

const savingsAccountSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SavingsAccount || mongoose.model('SavingsAccount', savingsAccountSchema);