const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

// Configure file upload directory
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.post('/', upload.single('file'), asyncHandler(createComplaint));
router.get('/track/:id', asyncHandler(getComplaintById)); // Public - for tracking complaints

// Protected routes (Admin only)
router.get('/', protect, asyncHandler(getAllComplaints));
router.get('/:id', protect, asyncHandler(getComplaintById));
router.put('/:id', protect, asyncHandler(updateComplaintStatus));
router.delete('/:id', protect, asyncHandler(deleteComplaint));

module.exports = router;
