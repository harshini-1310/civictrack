const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin with secure admin code validation
 * @access  Public (Requires valid admin secret code)
 */
exports.registerAdmin = async (req, res) => {
  try {
    console.log('📝 Registration request received:', { username: req.body.username, adminCode: req.body.adminCode ? '***' : 'missing' });
    const { username, password, adminCode } = req.body;

    // Validate input
    if (!username || !password || !adminCode) {
      console.log('❌ Missing fields - username:', !!username, 'password:', !!password, 'adminCode:', !!adminCode);
      return res.status(400).json({
        success: false,
        message: 'Please provide username, password, and admin code',
      });
    }

    // Validate admin code (never expose the actual code in error messages)
    console.log('🔐 Checking admin code...');
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      console.log('❌ Invalid admin code');
      return res.status(403).json({
        success: false,
        message: 'Invalid admin code. Registration failed.',
      });
    }

    // Check if admin already exists
    console.log('🔍 Checking if username already exists...');
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('❌ Username already exists');
      return res.status(400).json({
        success: false,
        message: 'Admin with this username already exists',
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Create admin
    console.log('💾 Creating admin account...');
    const admin = await Admin.create({
      username,
      password,
    });

    // Generate token
    const token = generateToken(admin._id);

    console.log('✅ Admin registered successfully:', admin._id);
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error('💥 Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find admin and select password field
    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordMatch = await admin.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current admin (verify token)
 * @access  Private
 */
exports.getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
