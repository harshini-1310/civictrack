const Complaint = require('../models/Complaint');

/**
 * Generate unique complaint ID in format: CIV-<6 digit random number>
 */
const generateComplaintId = () => {
  const randomNum = Math.floor(Math.random() * 1000000);
  return `CIV-${String(randomNum).padStart(6, '0')}`;
};

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint
 * @access  Public
 */
exports.createComplaint = async (req, res) => {
  try {
    const { description, category, severity, location, email, fullName, phone } = req.body;

    // Validate input
    if (!description || !category || !severity || !location || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields including email',
      });
    }

    const emailTrimmed = typeof email === 'string' ? email.trim() : '';
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailTrimmed || !emailPattern.test(emailTrimmed)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Generate unique complaint ID
    const complaintId = generateComplaintId();

    // Prepare complaint data
    const complaintData = {
      complaintId,
      description,
      category,
      severity,
      location,
      email: emailTrimmed,
      status: 'Pending',
    };

    // Add optional fields
    if (fullName) {
      complaintData.fullName = fullName.trim();
    }
    if (phone) {
      complaintData.phone = phone.trim();
    }

    // Add file information if file was uploaded
    if (req.file) {
      complaintData.attachment = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    }

    // Create complaint
    const complaint = await Complaint.create(complaintData);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints
 * @access  Private (Admin only)
 */
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    // Calculate summary statistics
    const summary = {
      total: complaints.length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
      pending: complaints.filter((c) => c.status === 'Pending').length,
      bySeverity: {
        low: complaints.filter((c) => c.severity === 'Low').length,
        medium: complaints.filter((c) => c.severity === 'Medium').length,
        high: complaints.filter((c) => c.severity === 'High').length,
        emergency: complaints.filter((c) => c.severity === 'Emergency').length,
      },
    };

    res.status(200).json({
      success: true,
      data: complaints,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/complaints/:id
 * @desc    Get a single complaint by ID (complaintId for tracking or _id for admin)
 * @access  Public (for tracking) / Private (for admin)
 */
exports.getComplaintById = async (req, res) => {
  try {
    const id = req.params.id.trim();
    let complaint;

    // Check if ID looks like a complaint ID (CIV-XXXXXX) for public tracking
    if (id.startsWith('CIV-')) {
      // Search by complaintId for public tracking
      complaint = await Complaint.findOne({ complaintId: id });
    } else {
      // Search by MongoDB _id for admin operations
      complaint = await Complaint.findById(id);
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   PUT /api/complaints/:id
 * @desc    Update complaint status and send email notification
 * @access  Private (Admin only)
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;

    // Validate status
    if (!['Pending', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending or Resolved',
      });
    }

    // Find and update complaint
    let complaint = await Complaint.findById(req.params.id.trim());

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    complaint.status = status;
    complaint.resolutionNotes = resolutionNotes || complaint.resolutionNotes;
    complaint.updatedAt = Date.now();

    await complaint.save();

    // Email notifications are handled from frontend via EmailJS; backend does not send email directly.

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   PUT /api/complaints/update/:complaintId
 * @desc    Update complaint details by complaintId (Public - for users to edit their complaint)
 * @access  Public
 */
exports.updateComplaintDetails = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { description, category, severity, location } = req.body;

    // Validate required fields
    if (!description || !category || !severity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: description, category, severity, location',
      });
    }

    // Find complaint by complaintId (the public ID like CIV-123456)
    let complaint = await Complaint.findOne({ complaintId: complaintId.trim() });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Update fields
    complaint.description = description.trim();
    complaint.category = category;
    complaint.severity = severity;
    complaint.location = location.trim();
    complaint.updatedAt = Date.now();

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete a complaint (Admin only)
 * @access  Private
 */
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id.trim());

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
