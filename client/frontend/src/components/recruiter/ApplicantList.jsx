import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
//import API from "../api/axiosInstance";
const ApplicantsList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

 
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/applications/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplicants(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch applicants");
      }
    };
   
  
  useEffect(() => {
    fetchApplicants();
  },[jobId]);
   const handleStatusChange = async (appId, newStatus) => {
      try {
        const token = localStorage.getItem("token");
        await API.patch(
          `/applications/update-status/${appId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Refresh after update
      } catch (error) {
        console.error("Failed to update status", error);
      }
    };
  
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Job Applicants</h2>
      {applicants.length === 0 ? (
        <p>No one has applied yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-indigo-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">10thMarks</th>
              <th className="p-2 border">12thMarks</th>
              <th className="p-2 border">Graduation</th>
              <th className="p-2 border">Resume</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app._id} className="text-center hover:bg-gray-100">
                <td className="p-2 border">{app.name}</td>
                <td className="p-2 border">{app.email}</td>
                <td className="p-2 border">{app.phone}</td>
                <td className="p-2 border">{app.marks10}</td>
                <td className="p-2 border">{app.marks12}</td>
                <td className="p-2 border">{app.gradMarks}</td>
                <td className="p-2 border">
                  <a
                    href={`http://localhost:5000${app.resume}`}
                    target="_blank"
                    
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
               <td>
  <select
    value={app.applicationStatus}
    onChange={(e) => handleStatusChange(app._id, e.target.value)}
    className="border border-gray-300 rounded px-2 py-1"
  >
    {["applied", "under review", "interview scheduled", "hired", "rejected"].map((status) => (
      <option key={status} value={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </option>
    ))}
  </select>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicantsList;
