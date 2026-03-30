const Complaint = require('../models/Complaint');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint
 * @access  Public
 */
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, severity, location, email } = req.body;

    // Validate input
    if (!description || !category || !severity || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Prepare complaint data
    const complaintData = {
      title: title || description.substring(0, 50) + (description.length > 50 ? '...' : ''), // Auto-generate title if not provided
      description,
      category,
      severity,
      location,
      email: email || null,
      status: 'Pending',
    };

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
 * @desc    Get a single complaint
 * @access  Private (Admin only)
 */
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id.trim());

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

    // Send email notification if complaint is resolved and email is available
    if (status === 'Resolved' && complaint.email) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: complaint.email,
          subject: 'Your Complaint Has Been Resolved',
          html: `
            <h2>Dear Citizen,</h2>
            <p>We are pleased to inform you that your complaint has been resolved.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3>${complaint.title}</h3>
              <p><strong>Category:</strong> ${complaint.category}</p>
              <p><strong>Severity:</strong> ${complaint.severity}</p>
              <p><strong>Location:</strong> ${complaint.location}</p>
              ${
                complaint.resolutionNotes
                  ? `<p><strong>Resolution Notes:</strong> ${complaint.resolutionNotes}</p>`
                  : ''
              }
            </div>
            <p>Thank you for reporting this issue. Your feedback helps us improve our services.</p>
            <p>Best regards,<br/>CivicTrack Administration</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }
    }

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
