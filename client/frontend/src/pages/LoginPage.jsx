import React, { useState } from "react";
//import API from "../api";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
const LoginPage = () => {
   const [user, setUser] = useState({ role: "" });
  //localStorage.setItem("user.role", user.role); // on successful login
 

  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
       const { token, user } = res.data;

      // ✅ Save token and role to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); 
      alert("Login successful");
      navigate("/Dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-[#E0F7FA] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
