require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const savingsRoutes = require('../routes/savingsRoutes');

const app = express();
app.use(express.json());
app.use('/api/savings', savingsRoutes);

describe('Savings & Transaction Integration Tests', () => {
  let testMemberId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crescent_sacco_test';
    await mongoose.connect(mongoUri);
    testMemberId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    // Clean up test collections after execution
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection('savingsaccounts').deleteMany({ memberId: testMemberId });
    }
    await mongoose.connection.close();
  });

  test('POST /api/savings/transaction - Deposit funds successfully', async () => {
    const res = await request(app)
      .post('/api/savings/transaction')
      .send({
        memberId: testMemberId,
        type: 'DEPOSIT',
        amount: 3000,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(3000);
    expect(res.body.transaction).toHaveProperty('accountId');
    expect(res.body.transaction.amount).toBe(3000);
  });

  test('POST /api/savings/transaction - Withdraw funds successfully', async () => {
    const res = await request(app)
      .post('/api/savings/transaction')
      .send({
        memberId: testMemberId,
        type: 'WITHDRAWAL',
        amount: 1000,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe(2000);
  });

  test('POST /api/savings/transaction - Reject withdrawal when balance is insufficient', async () => {
    const res = await request(app)
      .post('/api/savings/transaction')
      .send({
        memberId: testMemberId,
        type: 'WITHDRAWAL',
        amount: 50000,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Insufficient funds for withdrawal.');
  });

  test('GET /api/savings/transactions/:memberId - Fetch member audit trail', async () => {
    const res = await request(app).get(`/api/savings/transactions/${testMemberId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});