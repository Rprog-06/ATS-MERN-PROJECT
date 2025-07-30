// utils/logStatus.js
const logStatus = async (applicant, newStatus) => {
  if (!applicant.statusHistory) {
    applicant.statusLogs = [];
  }

  applicant.statusHistory.push({
    status: newStatus,
    updatedAt: new Date()
  });
 
  // ✅ This must exist
};

module.exports = logStatus;