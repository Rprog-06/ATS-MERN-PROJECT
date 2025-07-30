// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/overview', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const applicantCount = await User.countDocuments({ role: 'applicant' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    const jobCount = await Job.countDocuments();
    const applicationCount = await Applicant.countDocuments();

    res.json({ applicantCount, recruiterCount, jobCount, applicationCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;