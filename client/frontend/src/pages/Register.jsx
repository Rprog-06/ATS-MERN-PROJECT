import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
//import API from "../api/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (

    <div className="p-4 max-w-md mx-auto bg-blue-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
