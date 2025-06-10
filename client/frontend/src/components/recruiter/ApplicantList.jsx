import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal, Button } from "react-bootstrap";


const ApplicantsList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "Online",
    linkOrLocation: "",
  });
  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applicants");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = (appId, newStatus) => {
    if (newStatus === "rejected") {
      setSelectedAppId(appId);
      setPendingStatus(newStatus);
      setShowModal(true);
    } else {
      updateStatus(appId, newStatus);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/applications/update-status/${appId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplicants(); // refresh after update
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const confirmRejection = () => {
    updateStatus(selectedAppId, pendingStatus);
    setShowModal(false);
    setSelectedAppId(null);
    setPendingStatus("");
  };
  const openInterviewModal = (appId) => {
    setSelectedAppId(appId);
    setShowInterviewModal(true);
  };

  const handleInterviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/applications/schedule-interview/${selectedAppId}`,
        interviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowInterviewModal(false);
      setInterviewData({ date: "", time: "", mode: "Online", linkOrLocation: "" });
      setSelectedAppId(null);
      fetchApplicants();
    } catch (error) {
      console.error("Interview scheduling failed", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Job Applicants</h2>

      {applicants.length === 0 ? (
        <p>No one has applied yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-indigo-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">10th</th>
              <th className="p-2 border">12th</th>
              <th className="p-2 border">Graduation</th>
              <th className="p-2 border">Resume</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app._id} className="text-center hover:bg-gray-100">
                <td className="p-2 border">{app.name}</td>
                <td className="p-2 border">{app.email}</td>
                <td className="p-2 border">{app.phone}</td>
                <td className="p-2 border">{app.marks10}</td>
                <td className="p-2 border">{app.marks12}</td>
                <td className="p-2 border">{app.gradMarks}</td>
                <td className="p-2 border">
                  <a
                    href={`http://localhost:5000${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="p-2 border">
                  <select
                    value={app.applicationStatus}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {["applied", "under review", "interview scheduled", "hired", "rejected"].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {app.applicationStatus === "under review" && (
                    <button
                      onClick={() => openInterviewModal(app._id)}
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Schedule Interview
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to reject this application?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRejection}>
            Yes, Reject
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Interview Scheduling Modal */}
      <Modal show={showInterviewModal} onHide={() => setShowInterviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-3">
            <input
              type="date"
              className="form-control"
              value={interviewData.date}
              onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
            />
            <input
              type="time"
              className="form-control"
              value={interviewData.time}
              onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
            />
            <select
              className="form-control"
              value={interviewData.mode}
              onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}
            >
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Link or Location"
              value={interviewData.linkOrLocation}
              onChange={(e) =>
                setInterviewData({ ...interviewData, linkOrLocation: e.target.value })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInterviewModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInterviewSubmit}>
            Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
 
   
  );
};

export default ApplicantsList;
