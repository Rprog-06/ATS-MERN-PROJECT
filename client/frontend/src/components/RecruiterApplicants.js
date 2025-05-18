import React from "react";
import API from "../api";

const RecruiterApplicants = ({ applicants }) => {
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/applications/update-status/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Status updated!");
      // Optionally refetch applicants
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="space-y-4">
      {Array.isArray(applicants) && applicants.map((app) => (
        <div key={app._id} className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold">{app.name}</h3>
          <p>Email: {app.email}</p>
          <p>Phone: {app.phone}</p>
          <label className="block mt-2 text-sm font-medium text-gray-700">Status:</label>
          <select
            value={app.applicationStatus}
            onChange={(e) => handleStatusChange(app._id, e.target.value)}
            className="mt-1 block w-60 border border-gray-300 rounded px-2 py-1"
          >
            {["applied", "under review", "interview scheduled", "hired", "rejected"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
        </div>
      ))}
    </div>
  );
};

export default RecruiterApplicants;
