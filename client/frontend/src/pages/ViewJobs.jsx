import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
   const role = localStorage.getItem("user.role");
  const navigate = useNavigate();

  useEffect(() => {
     fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(console.error);
  }, []);
  const handleApply = (jobId) => {
    // Navigate to application form with jobId param
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">All Posted Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company} - {job.location}</p>
            <p className="text-sm mt-2">{job.description}</p>
            <p className="text-sm text-blue-600 mt-1">{job.salary}</p>
              {/* <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p> */}
            {role === "applicant" && (
              <button
                onClick={() => handleApply(job._id)}
                className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewJobs;
