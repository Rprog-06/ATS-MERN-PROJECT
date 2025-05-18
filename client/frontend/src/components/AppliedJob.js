import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api"; // Adjust path if needed

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("applications/recruiter", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (error) {
        console.error("Error loading applications", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">My Applications</h2>
      {Array.isArray(applications) && applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-gray-50 rounded shadow-md"
            >
              <h3 className="text-xl font-semibold">{app.job?.title}</h3>
              <p className="text-gray-600">Location: {app.job?.location}</p>
              <p className="text-gray-600">
                Applied on: {new Date(app.createdAt).toLocaleDateString()}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  app.applicationStatus === "applied"
                    ? "bg-blue-100 text-blue-800"
                    : app.applicationStatus === "under review"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.applicationStatus === "interview scheduled"
                    ? "bg-purple-100 text-purple-800"
                    : app.applicationStatus === "hired"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Status: {app.applicationStatus}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;