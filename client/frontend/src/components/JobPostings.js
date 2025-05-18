// src/components/JobPostings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import API from "../api/axiosInstance";

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await API.get('http://localhost:5000/api/jobPostings');
        setJobPostings(response.data);
      } catch (error) {
        console.error("There was an error fetching the job postings", error);
      }
    };

    fetchJobPostings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Job Postings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobPostings.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p>{job.companyName}</p>
            <p>{job.location}</p>
            <p className="text-sm">{job.description.substring(0, 100)}...</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPostings;
