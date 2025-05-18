import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api"; // Adjust the import based on your file structure
//import API from "../api/axiosInstance";
const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-pink-100 to-indigo-100">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">👤 Your Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || "Applicant"}</p>
        <p className="mt-4 text-gray-500 text-sm text-center">Connected to backend ✅</p>
      </div>
    </div>
  );
};

export default Profile;
