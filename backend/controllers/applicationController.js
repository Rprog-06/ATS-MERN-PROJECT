const Applicant = require("../models/Applicant");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


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
// const updateApplicationStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const application = await Application.findById(id).populate("applicant");

//     if (!application) return res.status(404).json({ message: "Application not found" });

//     application.status = status;
//     await application.save();

//     const applicantEmail = application.applicant.email;
//     const applicantName = application.applicant.name;

//     await sendEmail(
//       applicantEmail,
//       "Application Status Updated",
//       `Hello ${applicantName},\n\nYour application status has been updated to: ${status}.\n\n- ATS Team`
//     );

//     res.status(200).json({ message: "Status updated and email sent" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//  module.exports = { updateApplicationStatus };

