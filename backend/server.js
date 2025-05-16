const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('🛠 server.js loaded');
console.log('✅ .env loaded:', process.env.MONGO_URI);

const app = express();

// Middlewares
// const corsOptions = {
//   origin: ["https://your-frontend-service.onrender.com"],
//   credentials: true,
// };

app.use(cors());

app.use(express.json());
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Routes
const userRoutes = require('./routes/userRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/auth');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
             // ✅ Only one for user
app.use("/api/applications", applicantRoutes);    // ✅ Only one for applicants
app.use("/api/jobs", jobRoutes);

// Static folder for resume uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route


// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/atsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
