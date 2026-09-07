const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SavingsAccount = require('../models/SavingsAccount');
const Transaction = require('../models/Transaction');

// POST /api/savings/transaction - Process ledger transaction and create audit record
router.post('/transaction', async (req, res) => {
  try {
    const { memberId, type, amount } = req.body;

    if (!memberId || !type || amount === undefined) {
      return res.status(400).json({ message: 'Member ID, type, and amount are required.' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    const targetMemberId = mongoose.Types.ObjectId.isValid(memberId)
      ? new mongoose.Types.ObjectId(memberId)
      : memberId;

    let account = await SavingsAccount.findOne({ memberId: targetMemberId });

    if (type === 'WITHDRAWAL') {
      if (!account || account.balance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient funds for withdrawal.' });
      }
    }

    if (account) {
      const newBalance = type === 'DEPOSIT' 
        ? account.balance + numericAmount 
        : account.balance - numericAmount;

      await SavingsAccount.updateOne(
        { _id: account._id },
        { $set: { balance: newBalance } }
      );

      account.balance = newBalance;
    } else {
      account = new SavingsAccount({
        memberId: targetMemberId,
        balance: type === 'DEPOSIT' ? numericAmount : 0,
      });
      await account.save();
    }

    // Save transaction entry matching your Transaction schema (linked via accountId)
    const transactionRecord = new Transaction({
      accountId: account._id,
      type,
      amount: numericAmount,
    });
    await transactionRecord.save();

    return res.status(200).json({
      message: 'Transaction processed successfully',
      balance: account.balance,
      account,
      transaction: transactionRecord,
    });
  } catch (error) {
    console.error('SERVER TRANSACTION ERROR:', error);
    return res.status(500).json({
      message: 'Failed to post transaction.',
      error: error.message || String(error),
    });
  }
});

// GET /api/savings/transactions/:memberId - Fetch all transactions for a member
router.get('/transactions/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const targetMemberId = mongoose.Types.ObjectId.isValid(memberId)
      ? new mongoose.Types.ObjectId(memberId)
      : memberId;

    const account = await SavingsAccount.findOne({ memberId: targetMemberId });
    if (!account) {
      return res.status(200).json([]);
    }

    const history = await Transaction.find({ accountId: account._id })
      .sort({ timestamp: -1 })
      .limit(50);

    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching transaction history', error: error.message });
  }
});

// GET /api/savings/summary
router.get('/summary', async (req, res) => {
  try {
    const accounts = await SavingsAccount.find();
    const totalSavings = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
    res.status(200).json({ totalSavings });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating summary', error: error.message });
  }
});

// GET /api/savings/top-savers
router.get('/top-savers', async (req, res) => {
  try {
    const topSavers = await SavingsAccount.find()
      .populate('memberId', 'fullName name memberName')
      .sort({ balance: -1 })
      .limit(5);

    const formattedSavers = topSavers.map((s) => ({
      fullName:
        typeof s.memberId === 'object' && s.memberId !== null
          ? s.memberId.fullName || s.memberId.name || s.memberId.memberName || 'Unknown Member'
          : 'Unknown Member',
      balance: s.balance || 0,
    }));

    res.status(200).json(formattedSavers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top savers', error: error.message });
  }
});

// GET /api/savings/:memberId
router.get('/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const targetMemberId = mongoose.Types.ObjectId.isValid(memberId)
      ? new mongoose.Types.ObjectId(memberId)
      : memberId;

    const account = await SavingsAccount.findOne({ memberId: targetMemberId });
    if (!account) {
      return res.status(200).json({ balance: 0 });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching savings account', error: error.message });
  }
});

module.exports = router;