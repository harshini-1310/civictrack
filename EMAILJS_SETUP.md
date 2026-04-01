# EmailJS Setup Guide for Complaint Confirmation Emails

This guide explains how to set up EmailJS to send automatic confirmation emails to users when they submit complaints.

## Overview

The complaint submission feature now includes automatic confirmation emails:
- Users submit a complaint through the form
- Backend generates a unique complaint ID (format: `CIV-XXXXXX`)
- After successful backend storage, EmailJS sends a confirmation email
- If email fails, the complaint is still submitted successfully

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up Free"
3. Create an account using your email
4. Verify your email address

## Step 2: Create an Email Service

1. After login, go to **Email Services** (left sidebar)
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail**: Select "Gmail"
   - **Other**: Select "Other Email Service" and enter SMTP details
4. Configure the service:
   - For Gmail: Click "Connect Account" and authorize EmailJS
   - For others: Enter SMTP server details
5. Click **"Create Service"**
6. Copy your **Service ID** (e.g., `service_xxxxxxxxx`)

## Step 3: Create an Email Template

1. Go to **Email Templates** (left sidebar)
2. Click **"Create New Template"**
3. Use the following template content:

```
Subject: Complaint Registered Successfully

Dear {{name}},

Your complaint has been successfully registered with CivicTrack.

📋 Complaint Details:
- Complaint ID: {{complaint_id}}
- Category: {{category}}
- Submitted on: {{timestamp}}

You can use the Complaint ID to track your complaint status anytime.

Visit: https://yourapp.com/track-status?id={{complaint_id}}

Thank you for helping us improve our city!

Best regards,
CivicTrack Team
```

4. Configure template variables:
   - `{{name}}` - User's full name
   - `{{complaint_id}}` - Unique complaint ID
   - `{{category}}` - Issue category
   - `{{timestamp}}` - Will be auto-added by backend

5. Set recipient email to: `{{to_email}}`
6. Click **"Save"**
7. Copy your **Template ID** (e.g., `template_xxxxxxxxx`)

## Step 4: Get Your Public Key

1. Go to **Account** (top right menu)
2. Go to **API Keys** tab
3. Copy your **Public Key** (starts with a long string)

## Step 5: Configure Environment Variables

### Frontend (.env)

Add these variables to your frontend `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace with your actual IDs and keys from EmailJS.

### Example .env file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=service_abc123xyz
VITE_EMAILJS_TEMPLATE_ID=template_xyz789abc
VITE_EMAILJS_PUBLIC_KEY=abc123xyz789abc123xyz789abc123
```

## Step 6: Restart Development Servers

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Step 7: Test the Feature

1. Open the application
2. Fill out the complaint form:
   - Full Name: Test User
   - Email: your-email@example.com
   - Category: Roads & Potholes
   - Severity: High
   - Description: Test complaint
   - Location: Your address
3. Submit the form
4. Check:
   - Success message with Complaint ID (format: CIV-XXXXXX)
   - Confirmation email in your inbox

## Email Template Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Recipient email address | user@example.com |
| `{{name}}` | User's full name | John Doe |
| `{{complaint_id}}` | Unique complaint ID | CIV-123456 |
| `{{category}}` | Issue category | Roads & Potholes |

## Code Structure

### EmailJS Client (`frontend/src/services/emailjsClient.js`)

**Main Functions:**

1. **`sendComplaintConfirmation(params)`**
   - Sends confirmation email after complaint submission
   - Parameters:
     - `name`: User's full name
     - `email`: Recipient email
     - `complaintId`: Unique complaint ID
     - `category`: Issue category
   - Returns: `{success: boolean, message: string}`

2. **`sendEmail(toEmail, issueTitle)`**
   - Generic email sender (for other emails)
   - Returns: `{success: boolean, message: string}`

### ComplaintForm Workflow

```
User submits form
    ↓
Client-side validation
    ↓
STEP 1: POST to /api/complaints
    ↓
Backend generates complaint ID
    ↓
Complaint stored in database
    ↓
Backend returns complaint data with ID
    ↓
STEP 2: sendComplaintConfirmation() via EmailJS
    ↓
Email sent to user's email address
    ↓
Show success message to user
```

## Error Handling

- **If complaint submission fails**: Error message shown to user
- **If email fails but complaint succeeds**: 
  - Complaint is stored successfully
  - User sees warning message with complaint ID
  - Email error logged to browser console
  - User can still track their complaint

## Troubleshooting

### Emails not being sent?

1. **Check environment variables:**
   ```bash
   # Verify .env file exists and is loaded
   npm run dev  # Frontend should show env vars in console
   ```

2. **Check EmailJS dashboard:**
   - Go to EmailJS dashboard → Email Services
   - Verify service is active (green dot)
   - Check email limit usage

3. **Check email template:**
   - Verify template variables match exactly: `{{to_email}}`, `{{name}}`, etc.
   - Test send from EmailJS dashboard

4. **Check browser console:**
   - Look for EmailJS initialization errors
   - Should see: "EmailJS config: {SERVICE_ID: ..., TEMPLATE_ID: ..., PUBLIC_KEY: ***present***}"

5. **Gmail specific:**
   - If using Gmail, grant EmailJS access in account settings
   - Check "Less secure app access" settings if on older Gmail account

### Complaint ID format?

- Format: `CIV-XXXXXX` (6 random digits)
- Example: `CIV-123456`, `CIV-987654`
- Generated on backend during complaint creation

### Can I customize the email template?

Yes! Edit your template in EmailJS dashboard:
1. Go to Email Templates
2. Click on your template
3. Edit subject and body
4. Use any of these variables: `{{to_email}}`, `{{name}}`, `{{complaint_id}}`, `{{category}}`

## Security Notes

- Public Key is safe to expose in frontend code (it's designed to be public)
- Service ID and Template ID are also public (part of EmailJS architecture)
- Never expose your EmailJS API token or private credentials
- Email templates should sanitize user input

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Unlimited templates
- Unlimited recipients

For higher limits, upgrade to paid plan in account settings.

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- Get help: support@emailjs.com
- API Reference: https://www.emailjs.com/docs/rest-api/
