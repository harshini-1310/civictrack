const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getCurrentAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.post('/register', asyncHandler(registerAdmin));
router.post('/login', asyncHandler(loginAdmin));

// Protected routes
router.get('/me', protect, asyncHandler(getCurrentAdmin));

module.exports = router;
