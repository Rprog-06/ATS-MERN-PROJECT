import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/admin/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-indigo-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">{stats.applicantCount}</h2>
          <p>Applicants</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">{stats.recruiterCount}</h2>
          <p>Recruiters</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">{stats.jobCount}</h2>
          <p>Jobs Posted</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">{stats.applicationCount}</h2>
          <p>Applications</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;