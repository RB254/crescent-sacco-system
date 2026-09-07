const express = require('express');
const router = express.Router();
const { getAllMembers, createMember } = require('../controllers/memberController');

// Clean route definitions delegating directly to controller methods
router.route('/')
  .get(getAllMembers)
  .post(createMember);

module.exports = router;