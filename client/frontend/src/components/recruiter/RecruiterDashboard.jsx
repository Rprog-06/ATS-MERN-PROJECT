import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
//import API from "../api/axiosInstance";
const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);

 
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/jobs/recruiter", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to load your jobs.");
      }
    };

   
  ;
  useEffect(() => {fetchJobs()}, []);
  const handleDeleteJob = async (jobId) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    const token = localStorage.getItem("token");
    await API.delete(`/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchJobs(); // Refresh the jobs
  } catch (err) {
    console.error("Error deleting job", err);
  }
};

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Your Posted Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-4 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600 mb-2">{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Posted on:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

              <Link
                to={`/recruiter/Applicants/${job._id}`}
                className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Applicants
              </Link>
                 <button
  className="bg-red-500 text-white px-3 py-1 rounded"
  onClick={() => handleDeleteJob(job._id)}
>
  ❌ Delete
</button>
            </div>
          ))}
       
        </div>
      )}
      {/* ✅ Recruiter Only: View My Posted Jobs */}


    </div>
  );
};

export default RecruiterDashboard;


