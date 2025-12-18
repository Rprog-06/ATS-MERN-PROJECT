const express = require('express');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const upload = require("../middleware/upload");
const router = express.Router();
const {protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require('../middleware/roleMiddleware');
const sendEmail = require("../utils/sendEmail"); // Import this at the top
const parseResumeAndScore = require("../utils/resumeParser"); // Import the resume parser utility
const path=require('path');


// Import the necessary controller functions

const { getApplicantsByJobId } = require("../controllers/applicationController");
const { updateApplicationStatus } = require("../controllers/applicationController");



// Get all applications for a job
router.get('/job/:jobId', protect,async (req, res) => {
  try {
    
    const applicants = await Applicant.find({ job: req.params.jobId }).populate('user').select("+statusHistory");
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post("/apply", protect, upload.single("resume"), async (req, res) => {
  try {
    console.log("📥 Incoming application:", req.body);
    console.log("📎 Uploaded file:", req.file);

   const { jobId, name, email, phone, marks10, marks12, gradMarks,qualification,experience,gender,technology,location,kanakaEmployee,coverLetter, } = req.body;
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
     const status=score>=60 ? "applied":"rejected"; // Get the file path from multer
    const newApplication = new Applicant({
      user: req.user.id,
      job: jobId,
      name,
      email,
      phone,
      marks10,
      marks12,
      gradMarks,
      qualification,
      experience,
      gender,
      technology,
      location,
     kanakaEmployee,
      coverLetter,
     resume: req.file ? `/uploads/resumes/${req.file.filename}` : null,
     applicationStatus: status, // Set initial status based on score
    });

    await newApplication.save();
    logStatus(newApplication, status); // Log the initial status
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
  const { date, time, mode, linkOrLocation,round } = req.body;

  try {
    const application = await Applicant.findById(appId).populate("user", "email name").populate("job", "title");

    if (!application) return res.status(404).json({ message: "Application not found" });
  
      
    application.interviewDetails = { date, time, mode, linkOrLocation };
    if(round==="first") {
      // Update the application status based on the round
     application.applicationStatus = "first interview scheduled";
  await logStatus(application, "first interview scheduled");
     // Log the status change
     
    } else if(round==="second") {
      application.applicationStatus = "second interview scheduled";
    await logStatus(application, "second interview scheduled"); // Log the status change
    } 
    await application.save();

       // Send Email
   if(round==="first") {
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
   }else{
    const subjec = `Second Interview Scheduled for ${application.job.title}`;
    const messag = `Hello ${application.user.name},
    You have been shortlisted for an interview for the position: ${application.job.title}.

🗓 Date: ${date}
⏰ Time: ${time}
📍 Mode: ${mode}
🔗 ${linkOrLocation}

Please be prepared and arrive on time.

Best regards,
ATS Team`;

    await sendEmail(application.user.email, subjec, messag);

   }

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
    if(status==="hired"){
      await logStatus(application, "hired"); // Log the status change
    }
    else{
    // 📧 Send email notification
    const applicantEmail = application.user.email;
    const applicantName = application.user.name || "Applicant";
    const jobTitle = application.job?.title || "the job you applied for";

    const subject = `Application Status Update for ${jobTitle}`;
    const message = `Hello ${applicantName},\n\nYour application status has been updated to: "${status}".\n\nThank you for applying!\n\nRegards,\nRecruitment Team`;
 console.log("📧 Sending email to:", application.user.email);
    await sendEmail(applicantEmail, subject, message)
    }
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

router.get("/recruiter/filter/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { jobId } = req.params;
    const filters = req.query;

    const query = { job: jobId };

   if(filters.aptitudeTest) query.aptitudeTest = filters.aptitudeTest; // Convert string to boolean
    if (filters.qualification) query.qualification = filters.qualification;
    if (filters.gender) query.gender = filters.gender;
    if (filters.technology) query.technology = { $regex: filters.technology, $options: 'i' };
    if (filters.kanakaEmployee !== undefined) query.kanakaEmployee = filters.kanakaEmployee === "true";
    if (filters.status) query.applicationStatus = filters.status;
    
    if (filters.experience !== undefined && filters.experience !== '') {
      const exp= Number(filters.experience);
    if (!isNaN(exp)) {
      query.experience =exp; // Filter by experience greater than or equal to the specified value
    }
    }
    console.log("🔍 Filtering applicants with query:", filters);
    console.log("🔍 Query object:", query);
    const applicants = await Applicant.find(query).populate("user", "name email").populate("job", "title");

    res.status(200).json(applicants);
  } catch (error) {
    console.error("❌ Error filtering applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const logStatus = require("../utils/logStatus"); // Import the logStatus utility
 // assuming it's correct

router.post("/send-aptitude-link", protect, authorizeRoles("recruiter"), async (req, res) => {
  const { applicantIds } = req.body;

  if (!Array.isArray(applicantIds) || applicantIds.length === 0) {
    return res.status(400).json({ message: "No applicants selected" });
  }

  try {
    const applicants = await Applicant.find({ _id: { $in: applicantIds } });

    const results = await Promise.allSettled(
      applicants.map(app =>
        Promise.resolve().then(async () => {
          try {
            const email = app.email;
            const name = app.name || "Candidate";

            if (!email) {
              throw new Error(`Missing email for applicant ID: ${app._id}`);
            }

            const subject = "Kanaka Aptitude Test Link";
            const message = `Dear ${name},\n\nPlease complete your aptitude test using this link:\nhttps://kanaka-test.com/test/${app._id}\n\nBest of luck!\nTeam Kanaka`;

            await sendEmail(email, subject, message);
           app.applicationStatus = "aptitude test sent";
            await app.save(); // Save the updated application status
            await logStatus(app, "aptitude test sent"); // Log the status change
            

            console.log(`✅ Email sent to ${email}`);
            return { id: app._id, status: "success" };
          } catch (err) {
            console.error(`❌ Failed to send email to ${app.email} (${app._id}): ${err.message}`);
            return { id: app._id, status: "failed", error: err.message };
          }
        })
      )
    );

    const failed = results
      .filter(r => r.status === "fulfilled" && r.value.status === "failed")
      .map(r => r.value);

    if (failed.length > 0) {
      return res.status(200).json({
        message: "Some emails failed to send.",
        partialFailure: true,
        failed,
      });
    } else {
      return res.status(200).json({
        message: "All aptitude test emails sent successfully.",
        partialFailure: false,
      });
    }

  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({ message: "Server error while sending emails." });
  }
});
// POST /upload-aptitude-results
const csv = require("csv-parser");
const fs = require("fs");
// make sure this points to your multer setup

const parseCSV = require("../utils/parseCSV"); 
const uploadCSV=require("../middleware/csvUpload")// assuming this exists

router.post("/upload-aptitude-results", uploadCSV.single("file"), async (req, res) => {
  try {
    const results = await parseCSV(req.file.path); // [{ email, score }]
    const cutoff = Number(req.body.cutoff || 60); // default to 60 if not provided

    for (const result of results) {
      const email = result.email?.trim().toLowerCase(); 
      const score = Number(result.score);
      const status = score >= cutoff ? "Passed" : "Failed";
     const appStatus= score >= cutoff ? "aptitude test passed" : "aptitude test failed";
    // logStatus("aptitude test " ,status); // Log the status change
      // Log the status change
     const app= await Applicant.findOneAndUpdate(
        { email: result.email },
        {$set: { aptitudeTest: status,
          aptitudeScore: score,
        applicationStatus: appStatus,
        },$push:{statusHistory: {
        status: appStatus,
        updatedAt: new Date(),
      },
    },
  },
        { new: true,
           runValidators: false, 
         }
      );
      console.log(
  "CSV update:",
  email,
  updated ? "UPDATED" : "NOT FOUND");
      // if(app){
      //   app.statusHistory.push({status:appStatus,updatedAt:new Date()});
      //   await app.save(); // Log the status change
      // }
    }

    res.status(200).json({ message: "Aptitude results updated based on cutoff." });
  } catch (err) {
    console.error("CSV Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.patch("/update-interview-result/:id", protect, authorizeRoles("recruiter"), async (req, res) => {
  const { round, result,comment } = req.body; // round = first | second, result = Passed | Failed

  try {
    const statusMap = {
      first: {
        Passed:{ status: "first interview passed",
        logStatus: "first interview passed"},
        Failed: {status:"first interview failed",
        logStatus: "first interview failed"}
      },
      second: {
        Passed: {status:"second interview passed",
        logStatus: "second interview passed"},
        Failed:{ status:"second interview failed",
        logStatus: "second interview failed"}
      },
    };

    const app = await Applicant.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Applicant not found" });

    if (round === "first") {app.firstRoundInterview = result;
    app.firstRoundInterviewComment = comment || ""; }// Optional comment for first round interview
    if (round === "second") {
      app.secondRoundInterview = result;
    app.secondRoundInterviewComment = comment || "";}
     // Optional comment for second round interview
    const outcome= statusMap[round][result];
    app.applicationStatus =  outcome.status; // Update application status based on the round and result
   await logStatus(app, outcome.logStatus); // Log the status change  

    await app.save();
    res.status(200).json({ message: `Interview result updated to ${result} `});
  } catch (err) {
    console.error("Interview result update error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/hired-list", protect, authorizeRoles("recruiter"), async (req, res) => {
  const hired = await Applicant.find({ applicationStatus: "hired" });
  res.status(200).json(hired);
});
const generateOfferLetter = require("../utils/generateOfferLetter");

router.post("/send-offer/:id", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    
    const applicant = await Applicant.findById(req.params.id).populate("job").populate("user", "email name");
    console.log("�� Sending offer letter to applicant ID:", applicant?.user?.email);
    if (!applicant || applicant.applicationStatus !== "hired") {
      return res.status(400).json({ message: "Only hired applicants can receive offer letters." });
    }

    const filePath = await generateOfferLetter(applicant, applicant.job);
    if(!filePath) return res.status(500).json({ message: "Failed to generate offer letter." });
    // Send Email with attachment
    await sendEmail(
      applicant.user.email,
      "Your Offer Letter from Kanaka",
      `Hi ${applicant.name},\n\nAttached is your official offer letter.\n\nRegards,\nHR Team`,
      filePath// Pass file path to sendEmail
    );

    res.status(200).json({ message: "Offer letter sent successfully." });
    console.log("Offer leter path" + filePath);
    console.log(`�� Offer letter sent to ${applicant.user.email}`);
  } catch (err) {
    console.error("Offer letter error:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
