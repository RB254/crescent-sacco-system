const Loan = require('../models/Loan');
const SavingsAccount = require('../models/SavingsAccount');

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('memberId', 'fullName nationalId phone');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

exports.applyForLoan = async (req, res) => {
  try {
    const { memberId, principal, termMonths, annualInterestRate = 0.10 } = req.body;

    if (!memberId || !principal || !termMonths) {
      return res.status(400).json({ message: 'memberId, principal, and termMonths are required.' });
    }

    const numericPrincipal = Number(principal);
    const numericTerm = Number(termMonths);

    if (numericPrincipal <= 0 || numericTerm <= 0) {
      return res.status(400).json({ message: 'Principal and termMonths must be positive numbers.' });
    }

    // Server-side 3x Savings Limit Enforcement
    const savingsAccount = await SavingsAccount.findOne({ memberId });
    const currentBalance = savingsAccount ? savingsAccount.balance : 0;
    const maxAllowedLoan = currentBalance * 3;

    if (numericPrincipal > maxAllowedLoan) {
      return res.status(400).json({
        message: `Requested loan of KES ${numericPrincipal.toLocaleString()} exceeds maximum borrowing limit of KES ${maxAllowedLoan.toLocaleString()} (3x savings balance of KES ${currentBalance.toLocaleString()}).`
      });
    }

    const totalInterest = numericPrincipal * annualInterestRate * (numericTerm / 12);
    const totalRepayable = numericPrincipal + totalInterest;
    const monthlyInstallment = totalRepayable / numericTerm;

    const newLoan = new Loan({
      memberId,
      principal: numericPrincipal,
      termMonths: numericTerm,
      annualInterestRate,
      totalInterest,
      totalRepayable,
      monthlyInstallment
    });

    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create loan application', error: error.message });
  }
};