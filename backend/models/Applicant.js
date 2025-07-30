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
      enum: [
        'applied',
        'aptitude test sent',
        'aptitude test passed',
        'aptitude test failed',
        'first interview scheduled',
        'first interview passed',
        'first interview failed',
        'second interview scheduled',
        'second interview passed',
        'second interview failed',
        'hired',
        'rejected'
      ],
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
      mode: {
        type: String,
        enum: ['Online', 'In-person'],
        default: 'Online',
      },
      linkOrLocation: String, // Link for online interviews or location for in-person
    }, // e.g., "10:00 AM"

    kanakaEmployee: {
      type: Boolean,
      default: false, // Indicates if the applicant is already an employee
      // Employee who is handling the application
    },
    qualification: {
      type: String,
      enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', 'Other'],
      required: [true, 'Qualification is required'],
    },
    experience: {
      type: Number,
      default: 0, // Years of experience
      min: 0,
      max: 50, // Assuming a maximum of 50 years of experience
    },
    aptitudeTest: {
      type: String,
      enum: ['Passed', 'Failed', 'Not Attempted'],
      default: 'Not Attempted',
    },
    firstRoundInterview: {
      type: String,
      enum: ['Passed', 'Failed', 'Not Attempted'],
      default: 'Not Attempted',
      },
      firstRoundInterviewComment: {
        type: String,
        default: '', // Optional comment for first round interview
      },
    
    
    secondRoundInterview: {
      type: String,
      enum: ['Passed', 'Failed', 'Not Attempted'],
      default: 'Not Attempted',
     
    },
    secondRoundInterviewComment: {
      type: String,
      default: '',}, // Optional comment for second round interview 
    technology: {
      type: String,

    },
    location: {
      state: String,
      city: String,

    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    statusHistory: [
      {
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model('Applicant', applicantSchema);
