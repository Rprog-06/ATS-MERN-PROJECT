const Applicant = require("../models/Applicant");
const User = require("../models/User");

exports.getApplicantsByJobId = async (req, res) => {
  try {
    const applicants = await Applicant.find({ job: req.params.jobId })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};
