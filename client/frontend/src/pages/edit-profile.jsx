import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ name: res.data.name, email: res.data.email });
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/user/update",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated!");
      navigate("/Profile");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-md p-10 rounded-xl shadow-xl space-y-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-center text-purple-800">
          ✏️ Edit Profile
        </h2>
        <div>
          <label className="block text-gray-700 font-semibold">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-lg hover:bg-purple-800 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
