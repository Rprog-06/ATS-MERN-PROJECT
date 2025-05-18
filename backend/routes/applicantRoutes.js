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
router.get('/job/:jobId', async (req, res) => {
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
     resume: req.file ? `/uploads/resumes/${req.file.filename}` : null,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("❌ Error while saving application:", error);
    res.status(500).json({ message: "Server error while applying." });
  }
});
// Add this new route just before module.exports = router;
router.get("/recruiter/applications", protect, async (req, res) => {
  try {
    const recruiterId = req.user._id; // Logged-in recruiter

    // Find all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ postedBy: recruiterId });
    const jobIds = recruiterJobs.map((job) => job._id);

    // Find all applications for these jobs
    const applications = await Applicant.find({ job: { $in: jobIds } })
      .populate("user", "name email") // Applicant info
      .populate("job", "title");      // Job title

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching recruiter applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/recruiter", protect, authorizeRoles("applicant"), async (req, res) => {
  try {
    const applications = await Applicant.find({ user: req.user._id })
      .populate("job", "title location postedBy createdAt");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching user's applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/update-status/:appId", protect, authorizeRoles("recruiter"), async (req, res) => {
  const { appId } = req.params;
  const { status } = req.body;

  try {
    const application = await Applicant.findById(appId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.applicationStatus = status;
    await application.save();

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
