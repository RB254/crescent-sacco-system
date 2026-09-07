const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingsAccount', required: true },
  type: { type: String, enum: ['DEPOSIT', 'WITHDRAWAL'], required: true },
  amount: { type: Number, required: true, min: [0.01, 'Transaction amount must be positive'] },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);