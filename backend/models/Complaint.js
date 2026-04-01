const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a complaint description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: [
        'Roads & Potholes',
        'Drainage & Sewage',
        'Street Lighting',
        'Public Buildings',
        'Electricity Issues',
        'Water Supply',
        'Garbage Collection',
        'Internet / Cable',
        'Traffic Signals',
        'Illegal Parking',
        'Accidents / Hazards',
        'Fire Safety',
        'Air Pollution',
        'Water Pollution',
        'Noise Pollution',
        'Tree Damage',
        'Hospitals',
        'Schools',
        'Government Offices',
        'Public Transport',
        'Miscellaneous',
      ],
      required: [true, 'Please select a category'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      required: [true, 'Please select severity level'],
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
    complaintId: {
      type: String,
      unique: true,
      sparse: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Pending',
    },
    resolutionNotes: {
      type: String,
    },
    attachment: {
      filename: String,
      mimetype: String,
      size: Number,
      path: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
