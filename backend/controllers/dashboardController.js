const Member = require('../models/Member');
const SavingsAccount = require('../models/SavingsAccount');
const Loan = require('../models/Loan');

exports.getDashboardStats = async (req, res) => {
  try {
    const memberCount = await Member.countDocuments();

    const totalSavingsData = await SavingsAccount.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);

    let activeLoans = 0;
    let loanBook = 0;

    if (Loan && typeof Loan.countDocuments === 'function') {
      activeLoans = await Loan.countDocuments({ status: 'APPROVED' });

      const totalLoansData = await Loan.aggregate([
        { $match: { status: 'APPROVED' } },
        { $group: { _id: null, total: { $sum: '$principal' } } }
      ]);
      loanBook = totalLoansData.length > 0 ? totalLoansData[0].total : 0;
    }

    res.status(200).json({
      memberCount,
      totalSavings: totalSavingsData.length > 0 ? totalSavingsData[0].total : 0,
      activeLoans,
      loanBook
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error.message);
    res.status(500).json({ message: 'Error calculating metrics', error: error.message });
  }
};