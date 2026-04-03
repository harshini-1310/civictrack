import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_SUBMITTED = import.meta.env.VITE_EMAILJS_TEMPLATE_SUBMITTED;
const TEMPLATE_RESOLVED = import.meta.env.VITE_EMAILJS_TEMPLATE_RESOLVED;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const toCleanString = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

/**
 * Generic email sender function
 * @param {string} templateId - EmailJS template ID
 * @param {Object} params - Template parameters
 * @returns {Promise<{success:boolean,message:string,error?:Error}>}
 */
export async function sendEmail(templateId, params) {
  if (!templateId) {
    console.error('❌ sendEmail: Template ID is missing');
    return { success: false, message: 'Template ID is missing' };
  }

  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.error('❌ sendEmail: EmailJS environment variables are missing');
    return { success: false, message: 'EmailJS not configured' };
  }

  try {
    console.info(`📤 Sending email with template: ${templateId}`, params);

    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      params,
      PUBLIC_KEY
    );

    console.info('✅ Email sent successfully:', response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return {
      success: false,
      message: error?.text || error?.message || 'Failed to send email',
      error,
    };
  }
}

/**
 * Send complaint submission confirmation email
 * @param {Object} params
 * @param {string} params.to_email - Recipient email address
 * @param {string} params.complaintId - Unique complaint ID (CIV-XXXXXX)
 * @param {string} params.name - User's full name (optional)
 * @param {string} params.category - Complaint category (optional)
 * @returns {Promise<{success:boolean,message:string,error?:Error}>}
 */
export async function sendComplaintSubmission({
  to_email,
  complaintId,
  complaint_id,
  name = 'Valued Citizen',
  category = '',
}) {
  const email = toCleanString(to_email).toLowerCase();
  const id = toCleanString(complaintId || complaint_id);

  if (!email) {
    console.warn('⚠️ sendComplaintSubmission: Email address is missing');
    return { success: false, message: 'Email address is missing' };
  }

  if (!id) {
    console.warn('⚠️ sendComplaintSubmission: Complaint ID is missing');
    return { success: false, message: 'Complaint ID is missing' };
  }

  if (!TEMPLATE_SUBMITTED) {
    console.warn('⚠️ sendComplaintSubmission: TEMPLATE_SUBMITTED is not configured');
    return { success: false, message: 'Email template not configured' };
  }

  const normalizedCategory = toCleanString(category) || 'General';
  const submittedTimestamp = new Date().toLocaleString();

  // Include both camelCase and snake_case keys for template compatibility.
  const params = {
    to_email: email,
    email,
    id,
    complaintId: id,
    complaintID: id,
    complaint_id: id,
    complaintid: id,
    ticket_id: id,
    ticketId: id,
    tracking_id: id,
    trackingId: id,
    reference_id: id,
    referenceId: id,
    complaint_ref: id,
    complaint_reference: id,
    name: name?.trim() || 'Valued Citizen',
    category: normalizedCategory,
    complaint_category: normalizedCategory,
    issue_category: normalizedCategory,
    issue: normalizedCategory,
    timestamp: submittedTimestamp,
    submitted_at: submittedTimestamp,
  };

  console.info('📨 Sending complaint submission email with params:', params);
  return await sendEmail(TEMPLATE_SUBMITTED, params);
}

/**
 * Send complaint resolution email
 * @param {Object} params
 * @param {string} params.to_email - Recipient email address
 * @param {string} params.complaintId - Complaint ID (CIV-XXXXXX)
 * @param {string} params.category - Complaint category (optional)
 * @param {string} params.issue - Issue/complaint description
 * @param {string} params.resolution - Resolution details (optional)
 * @returns {Promise<{success:boolean,message:string,error?:Error}>}
 */
export async function sendComplaintResolution({
  to_email,
  complaintId,
  complaint_id,
  category = '',
  issue,
  resolution = '',
}) {
  const email = toCleanString(to_email).toLowerCase();
  const id = toCleanString(complaintId || complaint_id);
  const description = toCleanString(issue);

  if (!email) {
    console.warn('⚠️ sendComplaintResolution: Email address is missing');
    return { success: false, message: 'Email address is missing' };
  }

  if (!id) {
    console.warn('⚠️ sendComplaintResolution: Complaint ID is missing');
    return { success: false, message: 'Complaint ID is missing' };
  }

  if (!description) {
    console.warn('⚠️ sendComplaintResolution: Issue description is missing');
    return { success: false, message: 'Issue description is missing' };
  }

  if (!TEMPLATE_RESOLVED) {
    console.warn('⚠️ sendComplaintResolution: TEMPLATE_RESOLVED is not configured');
    return { success: false, message: 'Email template not configured' };
  }

  const normalizedCategory = toCleanString(category) || 'General';
  const normalizedResolution = toCleanString(resolution) || 'Your complaint has been resolved';
  const resolvedTimestamp = new Date().toLocaleString();

  const params = {
    to_email: email,
    email,
    id,
    complaintId: id,
    complaintID: id,
    complaint_id: id,
    complaintid: id,
    ticket_id: id,
    ticketId: id,
    tracking_id: id,
    trackingId: id,
    reference_id: id,
    referenceId: id,
    complaint_ref: id,
    complaint_reference: id,
    category: normalizedCategory,
    complaint_category: normalizedCategory,
    issue_category: normalizedCategory,
    issue: description,
    issue_description: description,
    description,
    resolution: normalizedResolution,
    resolution_notes: normalizedResolution,
    resolved_at: resolvedTimestamp,
    timestamp: resolvedTimestamp,
    submitted_at: resolvedTimestamp,
  };

  console.info('📨 Sending complaint resolution email with params:', params);
  return await sendEmail(TEMPLATE_RESOLVED, params);
}

/**
 * Send email through EmailJS (Generic - for other emails)
 * @deprecated Use sendComplaintSubmission() or sendComplaintResolution() instead
 * @param {string} toEmail
 * @param {string} issueTitle
 * @returns {Promise<{success:boolean,message:string}>}
 */
export async function sendGenericEmail(toEmail, issueTitle) {
  const effectiveEmail = typeof toEmail === 'string' ? toEmail.trim() : '';
  const effectiveIssue = issueTitle ? String(issueTitle).trim() : 'Complaint resolved';

  console.info('sendGenericEmail called with:', { toEmail: effectiveEmail, issueTitle: effectiveIssue });

  if (!effectiveEmail) {
    console.warn('sendGenericEmail: recipient email is missing or empty');
    return { success: false, message: 'recipient email missing' };
  }

  if (!SERVICE_ID || !TEMPLATE_SUBMITTED || !PUBLIC_KEY) {
    console.error('sendGenericEmail: EmailJS environment variables are missing');
    return { success: false, message: 'EmailJS environment not configured' };
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_SUBMITTED,
      {
        to_email: effectiveEmail,
        issue: effectiveIssue,
      },
      PUBLIC_KEY
    );

    console.info('sendGenericEmail success:', response);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('sendGenericEmail failed:', error);
    return { success: false, message: error?.text || error?.message || 'EmailJS send failed' };
  }
}

/**
 * Send complaint confirmation email (Backward compatibility wrapper)
 * @deprecated Use sendComplaintSubmission() instead
 * @param {Object} params
 * @param {string} params.name - User's full name
 * @param {string} params.email - Email address
 * @param {string} params.complaintId - Unique complaint ID
 * @param {string} params.category - Issue category
 * @returns {Promise<{success:boolean,message:string}>}
 */
export async function sendComplaintConfirmation({ name, email, complaintId, category }) {
  console.info('📨 sendComplaintConfirmation (deprecated) called, forwarding to sendComplaintSubmission');
  return await sendComplaintSubmission({
    to_email: email,
    complaintId,
    name,
    category,
  });
}

