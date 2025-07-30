import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
//import API from "../api";
const AddJob = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
     description: "",
  requirements: "",
  salary: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
     await API.post("/jobs/post", form, {

        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job added!");
      navigate("/Dashboard");
    } catch (error) {
      alert("Failed to add job");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <form
  onSubmit={handleSubmit}
  className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
>
  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Job</h2>

  {["title", "company", "location", "salary"].map((field) => (
    <input
      key={field}
      name={field}
      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
      value={form[field]}
      onChange={handleChange}
      className="w-full mb-4 p-2 border border-gray-300 rounded"
      required={field !== "location"}
    />
  ))}

  <textarea
    name="description"
    placeholder="Job Description"
    value={form.description}
    onChange={handleChange}
    className="w-full mb-4 p-2 border border-gray-300 rounded"
    rows={3}
    required
  />

  <textarea
    name="requirements"
    placeholder="Skills and Requirements"
    value={form.requirements}
    onChange={handleChange}
    className="w-full mb-4 p-2 border border-gray-300 rounded"
    rows={3}
    required
  />

  <select
    name="jobType"
    value={form.jobType}
    onChange={handleChange}
    className="w-full mb-4 p-2 border border-gray-300 rounded"
  >
    <option value="full-time">Full Time</option>
    <option value="part-time">Part Time</option>
    <option value="internship">Internship</option>
  </select>

  <button
    type="submit"
    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
  >
    Add Job
  </button>
</form>

    </div>
  );
};

export default AddJob;
