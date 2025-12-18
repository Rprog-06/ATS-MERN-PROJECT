import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [role, setRole] = useState(""); // ✅ Track user role in state

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. User might not be logged in.");
        return;
      }

      const res = await API.get("/applications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = res.data
        .filter((app) => app.job && app.job._id)
        .map((app) => String(app.job._id));

      setAppliedJobIds(ids);
    } catch (err) {
      console.error("Error fetching applied jobs", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
   // console.log("📦 Stored User:", storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // console.log("✅ Parsed User:", parsedUser);
      setRole(parsedUser.role); // ✅ Set role in state
      if (parsedUser.role === "applicant") {
         console.log("🧾 Role is applicant. Fetching applied jobs...");
        fetchAppliedJobs();
      }
      else {
      console.log("🔍 Role is:", parsedUser.role);
    }
  
}
    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">All Posted Jobs</h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by title, location, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(String(job._id));

            return (
              <div
                key={job._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-700">{job.title}</h3>
                <p className="text-gray-600">{job.company} - {job.location}</p>
                <p className="text-sm mt-2 text-gray-700">{job.requirements}</p>
                <p className="text-sm text-green-600 mt-1 font-semibold">Salary: {job.salary}</p>

                {role === "applicant" && (
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={alreadyApplied}
                    className={`mt-4 px-3 py-1 rounded text-white transition
                      ${alreadyApplied ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
                    `}
                  >
                    {alreadyApplied ? "Already Applied" : "Apply"}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-2 text-gray-500">No jobs match your search.</p>
        )}
      </div>
    </div>
  );
};

export default ViewJobs;
