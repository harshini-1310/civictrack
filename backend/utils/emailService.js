const nodemailer = require('nodemailer');

// Transporter configured for Gmail SMTP and environment variables.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration (optional, good for startup diagnostics)
transporter.verify((error, success) => {
  if (error) {
    console.error('✗ Gmail transporter verification failed:', error);
  } else {
    console.log('✓ Gmail transporter is ready.');
  }
});

/**
 * Send email using configured transporter
 * @param {string} to user email address
 * @param {string} subject email subject
 * @param {string} html HTML body
 */
const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL_USER and EMAIL_PASSWORD must be set in environment variables');
  }

  if (!to) {
    throw new Error('Email recipient is required');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendEmail,
};
