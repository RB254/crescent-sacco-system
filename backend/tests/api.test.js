const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');

// Mock Mongoose Models
jest.mock('../models/SavingsAccount', () => ({
  find: jest.fn().mockResolvedValue([{ balance: 1000 }, { balance: 2000 }]),
  // Updated mock: Return a KES 2,000,000 balance so 3x limit is KES 6,000,000 (covers 3,600,000 principal)
  findOne: jest.fn().mockResolvedValue({ balance: 2000000 }),
  updateOne: jest.fn().mockResolvedValue({ acknowledged: true }),
  save: jest.fn().mockResolvedValue({})
}));

jest.mock('../models/Transaction', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue({ _id: 'tx123' })
  }));
});

jest.mock('../models/Loan', () => {
  return jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockImplementation(function () {
      return Promise.resolve(this);
    })
  }));
});

// Express App Setup for Isolated Router Testing
const app = express();
app.use(express.json());

app.use('/api/savings', require('../routes/savingsRoutes'));
app.use('/api/loans', require('../routes/loanRoutes'));
app.use('/api/dashboard', require('../routes/dashboardRoutes'));

describe('Crescent SACCO API Unit & Integration Tests', () => {

  test('GET /api/savings/summary - Should return total savings structure', async () => {
    const res = await request(app).get('/api/savings/summary');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalSavings');
    expect(res.body.totalSavings).toBe(3000);
  });

  test('POST /api/savings/transaction - Should reject zero or negative amounts', async () => {
    const res = await request(app)
      .post('/api/savings/transaction')
      .send({
        memberId: new mongoose.Types.ObjectId().toString(),
        type: 'DEPOSIT',
        amount: -500
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/positive number/i);
  });

  test('POST /api/loans - Should correctly calculate 10% flat interest repayment schedule', async () => {
    const principal = 3600000;
    const termMonths = 10;
    
    const res = await request(app)
      .post('/api/loans')
      .send({
        memberId: new mongoose.Types.ObjectId().toString(),
        principal,
        termMonths,
        annualInterestRate: 0.10
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.totalInterest).toBe(300000);
    expect(res.body.totalRepayable).toBe(3900000);
    expect(res.body.monthlyInstallment).toBe(390000);
  });

});