const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant must be linked to a user'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must be linked to a job'],
    },
    name: String,
  email: String,
  phone: String,
  marks10: String,
  marks12: String,
  gradMarks: String,
 
    applicationStatus: {
      type: String,
      enum: ['applied', 'under review', 'interview scheduled', 'hired', 'rejected'],
      default: 'applied',
    },
    resume: {
      type: String, // Path or URL to uploaded resume
      required: [true, 'Resume is required'],
    },
    coverLetter: {
      type: String,
      maxlength: 1000, // Optional: Add cover letter support
    },
    notes: {
      type: String,
      default: '',
    },
    interview: {
      date: Date,
      time: String,
      mode:{
        type: String,
        enum: ['Online', 'In-person'],
        default: 'Online',
      },
      linkOrLocation: String, // Link for online interviews or location for in-person
      } // e.g., "10:00 AM"
    },
  
  { timestamps: true }
);

module.exports = mongoose.model('Applicant', applicantSchema);
