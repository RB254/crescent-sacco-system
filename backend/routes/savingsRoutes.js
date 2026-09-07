const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');

router.post('/transaction', savingsController.processTransaction);
router.get('/transactions/:memberId', savingsController.getMemberTransactions);
router.get('/summary', savingsController.getSavingsSummary);
router.get('/top-savers', savingsController.getTopSavers);
router.get('/:memberId', savingsController.getSavingsByMemberId);

module.exports = router;