const express = require('express');
const Job = require('../models/Job');
const {protect }= require('../middleware/authMiddleware');
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

// Create new job posting
router.post('/post', protect,async (req, res) => {
  const { title, company, description, requirements, salary, location } = req.body;


  try {
    const newJob = new Job({ title, company, description, requirements, salary, location, createdBy: req.user._id, });
   
    await newJob.save();
    res.status(201).json({ message: 'Job posted', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get("/recruiter", protect, async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  res.json(jobs);
});
router.delete("/:id", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await Application.deleteMany({ job:{$exists:true,$eq:null} }); 
    await job.deleteOne();
   
    res.status(200).json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
