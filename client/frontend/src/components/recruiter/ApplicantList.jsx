import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import API from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal, Button } from "react-bootstrap";
import API from "../../api/axiosInstance"; // Adjust the path as necessary
import { Link } from "react-router-dom";


const ApplicantsList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "Online",
    linkOrLocation: "",
    round: "first",
  });
  const [filter, setFilter] = useState({
    technology: "",
    qualification: "",
    status: "",
    gender: "",
    kanakaEmployee: "",
    experience: "",
    aptitudeTest: "",


  });
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedInterviewAppId, setSelectedInterviewAppId] = useState(null);
  const [interviewRound, setInterviewRound] = useState("first");
  const [interviewResult, setInterviewResult] = useState("Passed");
  const [interviewFeedback, setInterviewFeedback] = useState("");
  const handleResultSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/applications/update-interview-result/${selectedInterviewAppId}`,
        { round: interviewRound, result: interviewResult, comment: interviewFeedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Interview result updated successfully!");
      setShowResultModal(false);
      setInterviewResult("Passed");
      fetchApplicants();
    } catch (error) {
      console.error("Error updating result:", error);
      alert("Failed to update result");
    }
  };

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
      setInterviewData({ date: "", time: "", mode: "Online", linkOrLocation: "", });
      setSelectedAppId(null);
      fetchApplicants();
    } catch (error) {
      console.error("Interview scheduling failed", error);
    }
  };
  const applyFilter = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      for (const key in filter) {
        if (filter[key]) {
          queryParams.append(key, filter[key]);
        }
      }
      console.log("Filter applied:", filter)
      const res = await API.get(`/applications/recruiter/filter/${jobId}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },

      });
      setApplicants(res.data);
    } catch (error) {
      console.error("Failed to apply filters", error);
      alert("Failed to apply filters");
    }
  };

  const sendAptitudeEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/applications/send-aptitude-link",
        { applicantIds: selectedApplicants },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message || "Aptitude test links sent!");
      setSelectedApplicants([]);
      fetchApplicants(); // Refresh the list
    } catch (err) {
      console.error("❌ Error sending aptitude test links:", err);
      alert("Failed to send aptitude test links.");
    }
  };

  // State to store the selected CSV file
  const [csvFile, setCsvFile] = useState(null);
  const [cutoff, setCutoff] = useState(60);

  // Function to handle uploading the CSV file
  const handleCSVUpload = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("cutoff", cutoff); // Append cutoff value
      // formData.append("jobId", jobId);

      const res = await API.post("/applications/upload-aptitude-results", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message || "Aptitude results uploaded successfully!");
      setCsvFile(null);
      fetchApplicants(); // refresh the applicants list
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to upload CSV.");
    }
  };
  const [showStatusModal, setShowStatusModal] = useState(false);
const [currentStatusHistory, setCurrentStatusHistory] = useState([]);

const handleShowStatusHistory = (history) => {
  setCurrentStatusHistory(history || []);
  setShowStatusModal(true);
};
const generateOffer = async (appId) => {
  try {
    const token = localStorage.getItem("token");
     await API.post(`/applications/send-offer/${appId}`,null,{
       headers: {
        Authorization: `Bearer ${token}`,
      },
     });
    alert("✅ Offer letter sent to applicant via email.");
  } catch (err) {
    console.error("❌ Error sending offer letter:", err);
    alert("❌ Failed to send offer letter.");
  }
};




  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <div className="bg-gray-100 p-4 rounded shadow mb-4">
        <h3 className="text-lg font-bold mb-2">🔍 Filter Applicants</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <li>
              <Link to="/HiredList" className="text-blue-600 hover:underline">
                📄 Hired Applicants
              </Link>
            </li>
            <h4 className="text-lg font-semibold mb-2">📥 Upload Aptitude Results</h4>
            <input
              type="number"
              min="0"
              max="100"
              value={cutoff}
              onChange={(e) => setCutoff(e.target.value)}
              className="mr-3 p-2 border rounded"
              placeholder="Cutoff Marks"
            />
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
            <button
              className="ml-3 bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleCSVUpload}
              disabled={!csvFile}
            >
              Upload CSV
            </button>
          </div>

          <input type="text" className="h-100" placeholder="Technology" onChange={(e) => setFilter({ ...filter, technology: e.target.value })} />
          <select onChange={(e) => setFilter({ ...filter, qualification: e.target.value })}>
            <option value="">All Qualifications</option>
            <option value="B.Tech">B.tech</option>
            <option value="M.Tech">M.tech</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="Other">Other</option>
          </select>
          <select onChange={(e) => setFilter({ ...filter, gender: e.target.value })}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Others</option>
          </select>
          <select onChange={(e) => setFilter({ ...filter, kanakaEmployee: e.target.value })}>
            <option value="">Kanaka Employee?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <select onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">Any Status</option>
            <option value="applied">Applied</option>
            <option value="aptitude sent">Aptitude Sent</option>
            <option value="aptitude test passed">Aptitude Passed</option>
            <option value="aptitude test failed">Aptitude Failed</option>
            <option value="first interview scheduled">First Interview Scheduled</option>
            <option value="first interview passed">First Interview Passed</option>
            <option value="first interview failed">First Interview Failed</option>
            <option value="second interview scheduled">Second Interview Scheduled</option>
            <option value="second interview passed">Second Interview Passed</option>
            <option value="second interview failed">Second Interview Failed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="number"
            placeholder="Min Experience"
            onChange={(e) => setFilter({ ...filter, experience: e.target.value })}
          />
          <select
            className="form-control"
            onChange={(e) => setFilter({ ...filter, aptitudeTest: e.target.value })}
          >
            <option value="">Any Aptitude Status</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Not Attempted">Not Attempted</option>
          </select>
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={applyFilter}
        >
          Apply Filters
        </button>
      </div>

      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Job Applicants</h2>

      {applicants.length === 0 ? (
        <p>No one has applied yet.</p>
      ) : (
        <div>

          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-indigo-100">
              <tr>
                <th className="p-2 border">Select</th>
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
                  <td className="p-2 border"><input type="checkbox" checked={selectedApplicants.includes(app._id)} onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedApplicants([...selectedApplicants, app._id]);
                    }
                    else {
                      setSelectedApplicants(selectedApplicants.filter(id => id !== app._id));
                    }
                  }} /></td>

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
                      {["applied", "aptitude test sent", "aptitude test passed", "aptitude test failed",
                        "first interview scheduled", "first interview passed", "first interview failed", "second interview scheduled", "second interview passed", "second interview failed", "hired", "rejected"].map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                    </select>
                    {["aptitude test passed", "first interview passed"].includes(app.applicationStatus) && (
                      <div className="mt-3">
                        <select
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          value={interviewData.round}
                          onChange={(e) => setInterviewData({ ...interviewData, round: e.target.value })}
                        >
                          <option value="first">First</option>
                          <option value="second">Second</option>
                        </select>
                        <button
                          onClick={() => openInterviewModal(app._id)}
                          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Schedule Interview
                        </button>
                      </div>
                    )}

                    {["first interview scheduled", "second interview scheduled"].includes(app.applicationStatus) && (
                      <button
                        onClick={() => {
                          setSelectedInterviewAppId(app._id);
                          setShowResultModal(true);
                        }}
                        className="ml-2 mt-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Update Result
                      </button>
                    )}

                  </td>

                  <td className="p-2 border">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
                      onClick={() => handleShowStatusHistory(app.statusHistory)}
                    >
                      View log history
                    </button>
                     {app.applicationStatus === "hired" && (
  <button onClick={() => generateOffer(app._id)} className="btn btn-success">
    Generate Offer Letter
  </button>
)}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>

          {selectedApplicants.length > 0 && (
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={sendAptitudeEmails}>
              Send Aptitude Test Emails to {selectedApplicants.length} Applicants
            </button>
          )}
        </div>
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
            <input
              type="text"
              className="form-control"
              placeholder="Round"
              value={interviewData.round}
              onChange={(e) =>
                setInterviewData({ ...interviewData, round: e.target.value })
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
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Interview Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control mb-2"
            value={interviewRound}
            onChange={(e) => setInterviewRound(e.target.value)}
          >
            <option value="first">First Round</option>
            <option value="second">Second Round</option>
          </select>
          <select
            className="form-control"
            value={interviewResult}
            onChange={(e) => setInterviewResult(e.target.value)}
          >
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>
          <textarea
            className="form-control mt-2" 
            placeholder="Feedback (optional)"
            value={interviewFeedback}
            onChange={(e) => setInterviewFeedback(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResultSubmit}>
            Submit Result
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Status History</Modal.Title>
  </Modal.Header>
  <Modal.Body>
   {Array.isArray(currentStatusHistory) && currentStatusHistory.length > 0 ? (
  <ul className="list-disc space-y-1 ml-5 text-sm text-gray-700">
    {currentStatusHistory.map((entry, idx) => (
      <li key={idx}>
        <span className="font-semibold">{entry.status}</span> —{" "}
        <span className="text-gray-500">{new Date(entry.updatedAt).toLocaleString()}</span>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500 text-sm">No status history found.</p>
)}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </div>


  );
};

export default ApplicantsList;
