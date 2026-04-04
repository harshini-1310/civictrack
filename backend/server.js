require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('node:dns/promises');
const path = require('path');

dns.setServers(['1.1.1.1', '8.8.8.8']);

// Import routes
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error('✗ Missing environment variable: MONGODB_URI');
  process.exit(1);
}

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn('⚠️ EMAIL_USER or EMAIL_PASSWORD is not set. Email notifications will fail.');
}

// Connect to MongoDB using the required environment variable.
const mongodbUri = process.env.MONGODB_URI;

mongoose
  .connect(mongodbUri)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
