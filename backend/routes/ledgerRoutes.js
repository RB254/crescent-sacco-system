const express = require('express');
const router = express.Router();

// Fallback endpoint to ensure frontend GET /api/ledger/member/:id doesn't crash
router.get('/member/:memberId', async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member ledger' });
  }
});

// Fallback endpoint for recent ledger entries on Dashboard
router.get('/recent', async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent ledger entries' });
  }
});

module.exports = router;