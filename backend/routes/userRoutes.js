const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Profile Route - protected
router.get('/profile', protect,  asyncHandler(async (req, res) => {
  // req.user populated by protect middleware
  res.json(req.user);
}));

// Example of a protected recruiter-only route
router.post('/post', protect, authorizeRoles('recruiter'), asyncHandler(async (req, res) => {
  // your job posting logic here
  res.status(201).json({ message: 'Job posted successfully' });
}));
// PUT /api/user/updateconst express = require('express');

// Profile Route - protected


// Example of a protected recruiter-only route
router.post('/post', protect, authorizeRoles('recruiter'), asyncHandler(async (req, res) => {
  // your job posting logic here
  res.status(201).json({ message: 'Job posted successfully' });
}));

// PUT /api/user/update
router.put('/update', protect, asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    );
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error" });
  }
}));


module.exports = router;
