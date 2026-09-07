const Member = require('../models/Member');

// @desc    Fetch all members
// @route   GET /api/members
exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error('❌ Failed to fetch members:', error.message);
    next(error);
  }
};

// @desc    Register a new member
// @route   POST /api/members
exports.createMember = async (req, res, next) => {
  try {
    const { fullName, nationalId, phone, joinedDate, dateJoined, email } = req.body;

    const finalDate = joinedDate || dateJoined;

    const memberData = {
      fullName: fullName?.trim(),
      nationalId: nationalId?.trim(),
      phone: phone?.trim(),
      joinedDate: finalDate ? new Date(finalDate) : new Date()
    };

    if (email && email.trim() !== '') {
      memberData.email = email.trim().toLowerCase();
    }

    const newMember = new Member(memberData);
    const savedMember = await newMember.save();

    console.log('✅ Member successfully registered:', savedMember.fullName);
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('❌ Member registration failed:', error.message);
    res.status(400).json({ message: 'Failed to create member', error: error.message });
  }
};