require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import Routes
const memberRoutes = require('./routes/memberRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const loanRoutes = require('./routes/loanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ledgerRoutes = require('./routes/ledgerRoutes');

const app = express();

// 1. Security Headers Middleware (Configured to allow React scripts & styles)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// 2. Rate Limiting Middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// 3. Global Middleware & CORS Configuration
app.use(cors());
app.use(express.json());

// 4. Mount API Routes
app.use('/api/members', memberRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ledger', ledgerRoutes);

// Health Check Endpoint required by Render zero-downtime deploys
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Crescent SACCO API is active' });
});

// 5. Serve React Frontend Static Files & SPA Middleware (Bypasses path-to-regexp completely)
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
    return res.sendFile(path.join(frontendBuildPath, 'index.html'));
  }
  next();
});

// 6. Global Centralized Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
});

// Database Connection & Non-blocking Server Initialization
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Bind server port first to pass Render port checks
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Single-URL Server listening on port ${PORT}`);
  });
}

// Asynchronous MongoDB Connection
if (MONGODB_URI) {
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
    })
    .catch((err) => {
      console.error('❌ Database connection error:', err.message);
    });
} else {
  console.error('⚠️ Warning: MONGODB_URI missing from environment variables.');
}

module.exports = app;