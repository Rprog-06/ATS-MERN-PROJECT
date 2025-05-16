const express = require('express');
const Job = require('../models/Job');
const {protect }= require('../middleware/authMiddleware');
const { getJobsByRecruiter } = require("../controllers/jobController");
const router = express.Router();

// Create new job posting
router.post('/post', async (req, res) => {
  const { title, company, description, requirements, salary, location } = req.body;

  try {
    const newJob = new Job({ title, company, description, requirements, salary, location });
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
router.get("/recruiter", protect, getJobsByRecruiter);

module.exports = router;
