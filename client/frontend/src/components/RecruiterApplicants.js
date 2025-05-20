import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

const RecruiterApplicants = () => {
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/applications/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants", err);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/applications/update-status/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplicants(); // Refresh after update
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">🧑‍💼 All Applicants</h2>

      {applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {applicants.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-5 rounded-lg shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-800">
                {app.applicant?.name}
              </h3>
              <p className="text-gray-600">📧 {app.applicant?.email}</p>
              <p className="text-gray-600">📍 Job: {app.job?.title}</p>

              <div className="mt-3">
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Status:
                </label>
                <select
                  value={app.applicationStatus}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                >
                  {[
                    "applied",
                    "under review",
                    "interview scheduled",
                    "hired",
                    "rejected",
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicants;
