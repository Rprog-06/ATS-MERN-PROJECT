const express = require('express');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const upload = require("../middleware/upload");
const router = express.Router();
const {protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getApplicantsByJobId } = require("../controllers/applicationController");

// Create new application
router.post('/apply/:jobId',protect, authorizeRoles("applicant"),  async (req, res) => {
  const { userId, jobId, resume } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const newApplication = new Applicant({
      user: userId,
      job: jobId,
      resume,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted', application: newApplication });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for a job
router.get('/job/:jobId/applicants', async (req, res) => {
  try {
    const applicants = await Applicant.find({ job: req.params.jobId }).populate('user');
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post("/apply", protect, upload.single("resume"), async (req, res) => {
  try {
    console.log("📥 Incoming application:", req.body);
    console.log("📎 Uploaded file:", req.file);

    const { jobId, name, email, phone, marks10, marks12, gradMarks, coverLetter } = req.body;

    const newApplication = new Applicant({
      user: req.user.id,
      job: jobId,
      name,
      email,
      phone,
      marks10,
      marks12,
      gradMarks,
      coverLetter,
      resume: req.file ? req.file.path : null,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("❌ Error while saving application:", error);
    res.status(500).json({ message: "Server error while applying." });
  }
});
module.exports = router;
