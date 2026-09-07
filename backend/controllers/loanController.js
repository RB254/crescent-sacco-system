const Loan = require('../models/Loan');

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

    const totalInterest = principal * annualInterestRate * (termMonths / 12);
    const totalRepayable = principal + totalInterest;
    const monthlyInstallment = totalRepayable / termMonths;

    const newLoan = new Loan({
      memberId,
      principal,
      termMonths,
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