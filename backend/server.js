require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Routes
const memberRoutes = require('./routes/memberRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const loanRoutes = require('./routes/loanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');

const app = express();

// 1. Security Headers Middleware
app.use(helmet());

// 2. Rate Limiting Middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// 3. Global Middleware & CORS Configuration for Render Deployment
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy: Request origin blocked.'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// 4. Mount Routes
app.use('/api/members', memberRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ledger', ledgerRoutes);

// Health Check Endpoint required by Render zero-downtime deploys
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Crescent SACCO API is active' });
});

// 5. Global Centralized Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
});

// Database Connection & Server Initialization
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing from .env file');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB database successfully');

    try {
      await mongoose.connection.collection('savingsaccounts').dropIndex('accountNumber_1');
      console.log('⚡ Successfully dropped accountNumber_1 index');
    } catch (err) {
      console.log('ℹ️ Index check complete: accountNumber_1 index was already removed or does not exist.');
    }

    // Only start server listener if NOT running inside automated test runner
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
      });
    }
  })
  .catch((err) => console.error('❌ Database connection error:', err));

module.exports = app;