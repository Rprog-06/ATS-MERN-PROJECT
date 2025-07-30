// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './pages/LoginPage'; // Example
import './App.css'; // Import your CSS file
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddJob from "./pages/AddJob";
import ViewJobs from "./pages/ViewJobs";
import Profile from "./pages/Profile";
//import ViewJobs from "./components/ViewJobs";
import ApplyForm from "./components/ApplyForm";
import JobApplications from "./components/JobApplications";
import RecruiterDashboard from "./components/recruiter/RecruiterDashboard";
import ApplicantsList from "./components/recruiter/ApplicantList";
import EditProfile from "./pages/edit-profile";
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import HiredList from './components/hr/HiredList';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/LoginPage" element={<Login />} />
         <Route path="/Register" element={<Register />} />
          <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/AddJob" element={<AddJob />} />
         <Route path="/ViewJobs" element={<ViewJobs />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/apply/:jobId" element={<ApplyForm />} />
  {/* <Route path="/recruiter/applications/:jobId" element={<JobApplications />} /> */}
        <Route
          path="/recruiter/RecruiterDashboard"
          element={
            <PrivateRoute>
              <RecruiterDashboard />
            </PrivateRoute>
          }
        />
        {/* Add a route for the applicants list */} 
<Route path="/recruiter/Applicants/:jobId" element={<ApplicantsList />} />
        <Route path="/HiredList" element={<HiredList />} />

{/* <Route path="/Applications" element={<Applications />} /> */}

      </Routes>
     
    </Router>
  );
}
export default App;
          