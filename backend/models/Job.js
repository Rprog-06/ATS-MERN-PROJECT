const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  jobType: { type: String, default: 'full-time' },
  description: String,
  requirements: String,
  salary: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if using auth
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
