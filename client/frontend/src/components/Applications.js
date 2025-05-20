// src/components/Applications.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import API from "../api/axiosInstance";
import API from "../api"; // Adjust the path as necessary
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get('/Applications');
        setApplications(response.data);
      } catch (error) {
        console.error("There was an error fetching the applications", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      {/* My Applications Button/Card */}
      <div
        className="cursor-pointer bg-white shadow-md hover:shadow-lg p-6 rounded-lg mb-6"
        onClick={() => setShowApplications(!showApplications)}
      >
        <h1 className="text-2xl font-bold text-purple-700">📁 My Applications</h1>
        <p className="text-gray-500 mt-1">{showApplications ? "Click to hide" : "Click to view your applications"}</p>
      </div>

      {/* Applications Grid - Show only if true */}
      {showApplications && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-1">
                📝 {application.jobPostingId.title}
              </h3>
              <p className="text-gray-600 mb-1">
                📍 Location: {application.jobPostingId.location}
              </p>
              <p className="text-gray-600 mb-3">
                📅 Applied on: {new Date(application.createdAt).toLocaleDateString()}
              </p>
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Status: {application.status}
              </span>
              <button
                onClick={() => navigate(`/job/${application.jobPostingId._id}`)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              >
                View Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Applications;