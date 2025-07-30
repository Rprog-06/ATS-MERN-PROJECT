// src/components/hr/HiredList.jsx
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
const HiredList = () => {
  const [hired, setHired] = useState([]);

  useEffect(() => {
    const fetchHired = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/applications/hired-list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHired(res.data);
      } catch (err) {
        console.error("Failed to fetch hired applicants", err);
      }
    };

    fetchHired();
  }, []);


const downloadPDF = () => {
  const doc = new jsPDF();
  doc.text("Hired Applicants List", 14, 15);

  const tableColumn = ["Name", "Email", "Phone", "Qualification", "Experience"];
  const tableRows = [];

  hired.forEach((applicant) => {
    const row = [
      applicant.name,
      applicant.email,
      applicant.phone,
      applicant.qualification,
      applicant.experience + " yrs",
    ];
    tableRows.push(row);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("hired_applicants.pdf");
};

  return (
    
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-3xl font-bold text-green-700 mb-6">🎉 Hired Applicants</h2>
<button
  onClick={downloadPDF}
  className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  📄 Download PDF
</button>
      {hired.length === 0 ? (
        <p>No applicants have been hired yet.</p>
      ) : (
        
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Qualification</th>
              <th className="p-2 border">Experience</th>
            </tr>
          </thead>
          <tbody>
            {hired.map((app) => (
              <tr key={app._id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{app.name}</td>
                <td className="p-2 border">{app.email}</td>
                <td className="p-2 border">{app.phone}</td>
                <td className="p-2 border">{app.qualification}</td>
                <td className="p-2 border">{app.experience} yrs</td>
              </tr>
            

            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HiredList;