import React from "react";
import { useNavigate } from "react-router-dom";
import AppliedJobs from "../components/AppliedJob";
import RecruiterApplicants from "../components/RecruiterApplicants";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("user.role"); // Ensure this is set properly in localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user.role"); // Clear role as well
    navigate("/LoginPage");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 p-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">ATS Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-700 mb-2">
          Welcome back,{" "}
          <span className="text-indigo-600 capitalize">{role}</span> 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your job applications, resumes, and interview progress in one place.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Recruiter Only: Add New Job */}
        {role === "recruiter" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">➕ Add New Job</h3>
            <p className="text-gray-600 mb-4">Create a new job entry with details and deadlines.</p>
            <button
              onClick={() => navigate("/AddJob")}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Job
            </button>
          </div>
        )}

        {/* Common: View Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">📄 View All Jobs</h3>
          <p className="text-gray-600 mb-4">
            {role === "applicant"
              ? "Track and manage your posted jobs."
              : "Browse jobs and apply easily."}
          </p>
          <button
            onClick={() => navigate("/ViewJobs")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            View Jobs
          </button>
        </div>

        {/* Common: Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">👤 Your Profile</h3>
          <p className="text-gray-600 mb-4">Manage personal information and preferences.</p>
          <button
            onClick={() => navigate("/Profile")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Profile
          </button>
        </div>
      </div>
      {role === "recruiter" && (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition">
    <h3 className="text-xl font-semibold text-slate-800 mb-2">📋 My Dashboard</h3>
    <p className="text-gray-600 mb-4">Check your posted jobs and manage applicants.</p>
    <button
      onClick={() => navigate("/recruiter/RecruiterDashboard")}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Recruiter Dashboard
    </button>
  </div>
)}
   
    <div className="max-w-6xl mx-auto">
        {role === "recruiter" ? <RecruiterApplicants /> : <AppliedJobs />}
      </div>
    </div>
    
  );
};

export default Dashboard;
