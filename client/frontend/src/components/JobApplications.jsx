import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
//import API from "../api/axiosInstance";
const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/applications/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch applications");
      }
    };
    fetchApplications();
  }, [jobId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Applicants</h2>
      {applications.length === 0 ? (
        <p>No applications yet for this job.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app._id} className="border-b py-2">
              <p><strong>Name:</strong> {app.applicant.name}</p>
              <p><strong>Email:</strong> {app.applicant.email}</p>
              <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
              <p>
                <strong>Resume:</strong>{" "}
                <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Resume
                </a>
              </p>
              <p><strong>Status:</strong> {app.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplications;
