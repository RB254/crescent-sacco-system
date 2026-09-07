const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAWAL'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ledger', ledgerSchema);