// src/components/Applications.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import API from "../api/axiosInstance";
const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get('/applications');
        setApplications(response.data);
      } catch (error) {
        console.error("There was an error fetching the applications", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application._id} className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{application.applicantId.name}</h2>
            <p>{application.jobPostingId.title}</p>
            <p>Status: {application.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
