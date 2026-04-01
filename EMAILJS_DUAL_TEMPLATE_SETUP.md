# EmailJS Multi-Template Setup Guide

## Overview

The complaint system now uses **two separate email templates** for different scenarios:

1. **TEMPLATE_SUBMITTED** - Sent when a user submits a complaint
2. **TEMPLATE_RESOLVED** - Sent when an admin resolves a complaint

This guide walks you through setting up both templates in EmailJS.

## Prerequisites

- EmailJS account (free signup at https://www.emailjs.com/)
- Named your service appropriately
- Access to environment variables

## Step 1: Create Email Service (if not already done)

1. Go to **Email Services** in EmailJS dashboard
2. Click **"Add New Service"**
3. Select your email provider (Gmail recommended)
4. Connect your email account
5. Name your service (e.g., "CivicTrack")
6. Save and note your **Service ID** (e.g., `service_abc123xyz`)

## Step 2: Create TEMPLATE_SUBMITTED for Complaint Submissions

### Template Setup

1. Go to **Email Templates** → **"Create New Template"**
2. Set template name: `CivicTrack - Complaint Submitted`
3. Configure these fields:

| Field | Value |
|-------|-------|
| **Recipient Email** | `{{to_email}}` |
| **Subject** | `Complaint Registered Successfully - ID: {{complaintId}}` |

### Template Body

Use this content for the email body:

```
Dear {{name}},

Thank you for reporting this issue to CivicTrack!

Your complaint has been successfully registered with us.

═══════════════════════════════════════
📋 COMPLAINT DETAILS
═══════════════════════════════════════

Complaint ID:    {{complaintId}}
Category:        {{category}}
Status:          Pending
Date Submitted:  {{date}}

═══════════════════════════════════════

You can use your Complaint ID to track the status of your complaint anytime.

Visit: https://yourapp.com/track-status?id={{complaintId}}

Our team will review your complaint and take appropriate action.
We appreciate your contribution to making our city better!

Best regards,
CivicTrack Team
🏛️ Civic Complaint Management System
```

### Save Template

After entering content, click **"Save"**. 

Note your **Template ID** for TEMPLATE_SUBMITTED (format: `template_xxxxx`)

---

## Step 3: Create TEMPLATE_RESOLVED for Complaint Resolutions

### Template Setup

1. Go to **Email Templates** → **"Create New Template"**
2. Set template name: `CivicTrack - Complaint Resolved`
3. Configure these fields:

| Field | Value |
|-------|-------|
| **Recipient Email** | `{{to_email}}` |
| **Subject** | `Your Complaint Has Been Resolved - ID: {{complaintId}}` |

### Template Body

Use this content for the email body:

```
Dear Citizen,

Good news! Your complaint has been resolved.

═══════════════════════════════════════
✅ RESOLUTION DETAILS
═══════════════════════════════════════

Complaint ID:     {{complaintId}}
Issue:            {{issue}}
Status:           ✓ Resolved
Date Resolved:    {{date}}

Resolution:
{{resolution}}

═══════════════════════════════════════

Thank you for your patience while we worked on resolving this issue.
Your feedback helps us serve the community better.

If you have any follow-up concerns, please feel free to submit a new complaint.

Best regards,
CivicTrack Team
🏛️ Civic Complaint Management System
```

### Save Template

After entering content, click **"Save"**. 

Note your **Template ID** for TEMPLATE_RESOLVED (format: `template_xxxxx`)

---

## Step 4: Configure Environment Variables

### Frontend .env Setup

Create or update your `.env` file in the `frontend` directory:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123xyz
VITE_EMAILJS_TEMPLATE_SUBMITTED=template_submitted123
VITE_EMAILJS_TEMPLATE_RESOLVED=template_resolved456
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Get Your Credentials

1. **Service ID**: From Email Services dashboard
2. **Template IDs**: From each template's details
3. **Public Key**: From Account → API Keys

### Example .env File

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_civictrack_gmail
VITE_EMAILJS_TEMPLATE_SUBMITTED=template_complaint_submit_abc123
VITE_EMAILJS_TEMPLATE_RESOLVED=template_complaint_resolve_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123xyz789def456ghi789jkl012
```

---

## Step 5: Restart Your Application

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run dev
```

### Verify Configuration

Open browser console (F12 → Console tab). You should see:

```
📧 EmailJS Configuration: {
  SERVICE_ID: "service_civictrack_gmail",
  TEMPLATE_SUBMITTED: "template_complaint_submit_abc123",
  TEMPLATE_RESOLVED: "template_complaint_resolve_xyz789",
  PUBLIC_KEY: "✅ Present"
}
```

If you see ❌ Missing, check your .env file and restart the dev server.

---

## Step 6: Test Both Flows

### Test Complaint Submission

1. Open the application
2. Fill out the complaint form:
   - Full Name: "Test User"
   - Email: your-email@example.com
   - Category: Select any
   - Severity: Select any
   - Description: "Test complaint"
   - Location: "Test location"
3. Click **"Submit Complaint"**
4. Should see success message with Complaint ID (CIV-XXXXXX)
5. Check your email under **TEMPLATE_SUBMITTED**

### Test Complaint Resolution

1. Login to admin dashboard
2. Find a complaint
3. Click to open details
4. Provide resolution notes
5. Click **"Resolve"**
6. Should see success alert
7. Check your email under **TEMPLATE_RESOLVED**

---

## Email Template Variables Reference

### TEMPLATE_SUBMITTED (Complaint Submission)

| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Recipient email address | user@example.com |
| `{{name}}` | User's full name | John Doe |
| `{{complaintId}}` | Unique complaint ID | CIV-123456 |
| `{{category}}` | Complaint category | Roads & Potholes |
| `{{date}}` | Current date | Current date will be auto-filled |

### TEMPLATE_RESOLVED (Complaint Resolution)

| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Recipient email address | user@example.com |
| `{{complaintId}}` | Unique complaint ID | CIV-123456 |
| `{{issue}}` | Complaint description | "Pothole on Main Street" |
| `{{resolution}}` | Resolution notes from admin | "Repaired on 2024-01-20" |
| `{{date}}` | Current date | Current date will be auto-filled |

---

## Code Integration Details

### ComplaintForm.jsx (Submission)

```javascript
import { sendComplaintSubmission } from '../services/emailjsClient';

// ... in handleSubmit after backend success:

const emailResult = await sendComplaintSubmission({
  to_email: formData.email,        // Email address
  complaintId: complaintIdValue,   // From backend response
  name: userFullName,              // User's name
  category: formData.category,     // Category submitted
});
```

### ComplaintDrawer.jsx (Resolution)

```javascript
import { sendComplaintResolution } from '../services/emailjsClient';

// ... in handleResolve after backend success:

const emailResult = await sendComplaintResolution({
  to_email: updatedComplaint.email,           // From database
  complaintId: updatedComplaint.complaintId,  // From database
  issue: updatedComplaint.description,        // Original issue
  resolution: resolutionNotes,                // Admin's notes
});
```

---

## Error Handling

Both email functions return:

```javascript
{
  success: boolean,      // true if email sent
  message: string,       // Status message
  error: Error          // Error object (if failed)
}
```

### Example Error Handling

```javascript
const result = await sendComplaintSubmission({...});

if (result.success) {
  console.info('✅ Email sent successfully');
} else {
  console.warn('⚠️ Email failed:', result.message);
  // But complaint is still registered - no need to block user
}
```

---

## Console Log Monitoring

Check browser console to see email flow:

### Submission Flow
```
📧 EmailJS Configuration: {...}
📨 Sending complaint submission email with params: {
  to_email: "user@example.com",
  complaintId: "CIV-123456",
  name: "John Doe",
  category: "Roads & Potholes"
}
✅ Email sent successfully: {...}
```

### Resolution Flow
```
📨 Sending complaint resolution email with params: {
  to_email: "user@example.com",
  complaintId: "CIV-123456",
  issue: "Pothole on Main Street",
  resolution: "Fixed on 2024-01-20"
}
✅ Email sent successfully: {...}
```

---

## Troubleshooting

### Emails not sending?

1. **Check environment variables**
   ```bash
   # Verify .env has all four variables:
   VITE_EMAILJS_SERVICE_ID
   VITE_EMAILJS_TEMPLATE_SUBMITTED
   VITE_EMAILJS_TEMPLATE_RESOLVED
   VITE_EMAILJS_PUBLIC_KEY
   ```

2. **Check EmailJS Dashboard**
   - Email Services: Status should be green (Active)
   - Verify email limit not exceeded (200 emails/month free tier)
   - Check template IDs match .env exactly

3. **Verify Templates**
   - TEMPLATE_SUBMITTED has recipient: `{{to_email}}`
   - TEMPLATE_RESOLVED has recipient: `{{to_email}}`
   - All template variables are spelled correctly with curly braces

4. **Browser Console**
   - F12 → Console tab
   - Look for EmailJS initialization logs
   - Check for template variable mismatch errors

### "Template not configured" error?

- Check that TEMPLATE_IDS are set in .env
- Verify they use `VITE_` prefix (Vite env variables)
- Restart the dev server after changing .env

### Checking Email Delivery

1. Go to EmailJS Dashboard
2. Click on your service
3. Go to **"Logs"** tab
4. See recent emails sent
5. Click on entry to see details and any errors

---

## Best Practices

✅ **DO**
- Use template variables for personalization
- Include complaint ID for tracking
- Test both templates after setup
- Monitor email logs in EmailJS dashboard
- Keep resolution emails professional

❌ **DON'T**
- Commit .env to Git (add to .gitignore)
- Share public key on public repositories
- Put HTML in templates (use plain text)
- Use hardcoded email addresses

---

## Customization Examples

### Adding Timestamp to Templates

In **TEMPLATE_SUBMITTED**:
```
Date Submitted:  {{date}}
Time:            {{time}}
```

### Adding Department Info

In **TEMPLATE_RESOLVED**:
```
Handled by:      {{department}}
Ticket Number:   {{ticketNumber}}
```

### Custom Message

Update the function call in code:
```javascript
const emailResult = await sendComplaintResolution({
  to_email: updatedComplaint.email,
  complaintId: updatedComplaint.complaintId,
  issue: updatedComplaint.description,
  resolution: `Dear ${adminName}, your complaint has been resolved.`, 
});
```

---

## Gmail-Specific Setup

If using Gmail:

1. Create an app-specific password:
   - Gmail Settings → Security → 2-Step Verification
   - App passwords → Select App: Mail, Device: Windows
   - Generate 16-character password

2. Use this password in EmailJS:
   - Email Services → Gmail
   - Use the 16-character app password

3. No need to lower security settings

---

## Support Resources

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **Email Templates Guide**: https://www.emailjs.com/docs/user-guide/templates/
- **Template Variables**: https://www.emailjs.com/docs/user-guide/dynamic-content/
- **Troubleshooting**: https://www.emailjs.com/docs/faqs/

---

## Verification Checklist

- [ ] EmailJS account created
- [ ] Email service configured and active
- [ ] TEMPLATE_SUBMITTED created and tested
- [ ] TEMPLATE_RESOLVED created and tested
- [ ] All 4 environment variables in .env
- [ ] Frontend dev server restarted
- [ ] Complaint submission sends email
- [ ] Complaint resolution sends email
- [ ] Both emails received correctly
- [ ] Template variables display correct values
- [ ] Browser console shows successful logs

---

## Next Steps

After successful setup:

1. ✅ Test both email flows thoroughly
2. ✅ Customize email templates with your branding
3. ✅ Set up email templates in your own language (if needed)
4. ✅ Monitor email logs for delivery issues
5. ✅ Consider upgrading EmailJS for higher limits
6. ✅ Add admin notification emails (optional)
7. ✅ Implement email signatures with logo (optional)

