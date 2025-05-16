const Job = require("../models/Job");

exports.getJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};
