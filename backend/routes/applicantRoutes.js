const express = require('express');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const upload = require("../middleware/upload");
const router = express.Router();
const {protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require('../middleware/roleMiddleware');
const sendEmail = require("../utils/sendEmail"); // Import this at the top
const parseResumeAndScore = require("../utils/resumeParser"); // Import the resume parser utility
// Import the necessary controller functions

const { getApplicantsByJobId } = require("../controllers/applicationController");
const { updateApplicationStatus } = require("../controllers/applicationController");



// Get all applications for a job
router.get('/job/:jobId', protect,async (req, res) => {
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
     const filePath = req.file.path;
     const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
   // Ensure requirements is a proper keyword array
   const rawRequirements = job.requirements;
const requirements = Array.isArray(rawRequirements)
  ? rawRequirements.flatMap(r => r.split(",").map(k => k.trim()))
  : rawRequirements?.split(",").map(k => k.trim()) || [];
// Ensure requirements is a string
     const {score}=await parseResumeAndScore(filePath,requirements); // Parse the resume and get the score
     const status=score>=60 ? "under review":"rejected"; // Get the file path from multer
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
     applicationStatus: status, // Set initial status based on score
    });

    await newApplication.save();
    const subject = `Your Application Status for Job ID: ${jobId}`;
    const message =
      `Hello ${name},\n\n +
      Thank you for applying. Based on an initial resume screening, your application status is:\n\n 
      📌 **${status.toUpperCase()}**\n\n 
      ATS Resume Score: ${score}/100\n\n 
      We’ll keep you posted on any updates.\n\nRegards,\nATS Recruitment Team`;

    await sendEmail(email, subject, message); // ✅ Send mail
    res.status(201).json({ message: "Application submitted successfully.",
      score,status, 
     });
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
// Schedule interview
router.post("/schedule-interview/:appId", protect, authorizeRoles("recruiter"), async (req, res) => {
  const { appId } = req.params;
  const { date, time, mode, linkOrLocation } = req.body;

  try {
    const application = await Applicant.findById(appId).populate("user", "email name").populate("job", "title");

    if (!application) return res.status(404).json({ message: "Application not found" });

    application.applicationStatus = "interview scheduled";
    application.interviewDetails = { date, time, mode, linkOrLocation };
    await application.save();

    // Send Email
    const subject = `Interview Scheduled for ${application.job.title}`;
    const message = `Hello ${application.user.name},

You have been shortlisted for an interview for the position: ${application.job.title}.

🗓 Date: ${date}
⏰ Time: ${time}
📍 Mode: ${mode}
🔗 ${linkOrLocation}

Please be prepared and arrive on time.

Best regards,
ATS Team`;

    await sendEmail(application.user.email, subject, message);

    res.status(200).json({ message: "Interview scheduled and email sent", application });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//Update application status and send email notification
router.patch("/update-status/:appId", protect, authorizeRoles("recruiter"), async (req, res) => {
  const { appId } = req.params;
  const { status } = req.body;

  try {
    const application = await Applicant.findById(appId) .populate("user", "email name")
      .populate("job", "title");;
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (!application.user?.email) {
      console.error("❌ Applicant email not found");
      return res.status(400).json({ message: "Applicant email missing" });
    }

    application.applicationStatus = status;
    await application.save();
    // 📧 Send email notification
    const applicantEmail = application.user.email;
    const applicantName = application.user.name || "Applicant";
    const jobTitle = application.job?.title || "the job you applied for";

    const subject = `Application Status Update for ${jobTitle}`;
    const message = `Hello ${applicantName},\n\nYour application status has been updated to: "${status}".\n\nThank you for applying!\n\nRegards,\nRecruitment Team`;
 console.log("📧 Sending email to:", application.user.email);
    await sendEmail(applicantEmail, subject, message)

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get('/me',protect, async (req, res) => {
  try {
    // Make sure only applicants can access this route
    if (req.user.role !== 'applicant') {
      return res.status(403).json({ message: 'Access denied. Applicants only.' });
    }

    const applications = await Applicant.find({ user: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applicant applications:", err);
    res.status(500).json({ message: 'Server error' });
  }
});
//router.put("/application/:id/status", updateApplicationStatus);



module.exports = router;
