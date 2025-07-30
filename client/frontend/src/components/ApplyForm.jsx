import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import API from "../api";
import API from "../api/axiosInstance";
const ApplyForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
     name: "",
    email: "",
    phone: "",
    marks10: "",
    marks12: "",
    gradMarks: "",
    qualification: "",
    experience: "",
    gender: "",
    technology: "",
    location: "",
  kanakaEmployee: false, // Default to false, can be changed by user
    coverLetter: "",

    resume: null,

  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      data.append("jobId", jobId);

      await API.post("/applications/apply", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Application submitted successfully!");
      navigate("/Dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit application");
    }
  };
  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="number" name="marks10" placeholder="10th Marks (%)" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="number" name="marks12" placeholder="12th Marks (%)" onChange={handleChange} required className="w-full border p-2 rounded" />
        
        
        <input type="number" name="gradMarks" placeholder="Graduation Marks (%)" onChange={handleChange} required className="w-full border p-2 rounded" />
        <select name="qualification" onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select Qualification</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
          <option value="BCA">BCA</option>
          <option value="MCA">MCA</option>
          <option value="BBA">BBA</option>
          <option value="MBA">MBA</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" name="experience" placeholder="Years of Experience" onChange={handleChange} className="w-full border p-2 rounded" />
      <select name="gender" onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      
      <input type="text" name="technology" placeholder="Primary Technology" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="text" name="location" placeholder="City,State" onChange={handleChange} className="w-full border p-2 rounded" />
    
     <input type="checkbox" name="kanakaEmployee" checked={formData.kanakaEmployee} onChange={(e)=>setFormData({...formData,kanakaEmployee:e.target.checked})} />
      KanakaEmployee
        <textarea name="coverLetter" placeholder="Cover Letter (optional)" onChange={handleChange} rows="4" className="w-full border p-2 rounded" />
        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required className="w-full" />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;