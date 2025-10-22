import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await API.get("/user/profile", {
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
    return (
      <div className="text-center mt-20 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200">
      <div className="bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-xl text-center transition-transform duration-500 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-purple-900 mb-6 flex items-center justify-center gap-2">
          👤 Your Profile
        </h2>
        <div className="text-left space-y-4 text-gray-800">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {user.role || "Applicant"}</p>
        </div>
        <p className="mt-6 text-sm text-green-700 font-medium">
          ✅ Connected to backend
        </p>
        <button
          onClick={() => navigate("/edit-profile")}
          className="mt-8 px-6 py-2 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition duration-300"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
