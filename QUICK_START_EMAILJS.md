# Quick Start - Complaint Feature with EmailJS

## ✅ What's Been Implemented

Your complaint submission feature is complete with:

1. **Unique Complaint IDs** - Format: `CIV-XXXXXX` (e.g., CIV-123456)
2. **Backend API** - Stores complaints in MongoDB
3. **EmailJS Integration** - Sends automatic confirmation emails
4. **Error Handling** - Graceful failures, still shows success if email fails
5. **Duplicate Prevention** - Can't submit form twice accidentally
6. **Enhanced Form** - Now includes Full Name, Phone, and Email fields

## 🚀 Quick Setup (5 Minutes)

### Step 1: Register with EmailJS (1 minute)

1. Go to https://www.emailjs.com/
2. Click "Sign Up Free"
3. Complete signup and verify email

### Step 2: Set Up Email Service (2 minutes)

1. Login to EmailJS dashboard
2. Go to "Email Services" → "Add New Service"
3. Select Gmail (or your email provider)
4. Connect your email account
5. Copy your **Service ID** (format: `service_xxxxx`)

### Step 3: Create Email Template (1 minute)

1. Go to "Email Templates" → "Create New Template"
2. Configure:
   - **Subject:** `Complaint Registered Successfully`
   - **Recipient:** `{{to_email}}`
   - **Body:** Use template below
3. Copy your **Template ID** (format: `template_xxxxx`)

**Template Body:**
```
Hello {{name}},

Your complaint has been successfully registered.

Complaint ID: {{complaint_id}}
Category: {{category}}

You can use this ID to track your complaint.

Thank you,
CivicTrack Team
```

### Step 4: Get API Credentials (1 minute)

1. Go to "Account" → "API Keys"
2. Copy your **Public Key** (long string)

### Step 5: Add to .env File (0 minutes)

**Frontend `.env` file:**
```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Replace with your actual keys!

### Step 6: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🧪 Test It

1. Open http://localhost:5173 (or your frontend URL)
2. Fill out complaint form:
   - Full Name: "Test User"
   - Email: your-email@example.com
   - Category: Any option
   - Severity: Any level
   - Location: Any address
   - Description: Test complaint
3. Click "Submit Complaint"
4. See success with **Complaint ID** (e.g., CIV-123456)
5. Check your email inbox for confirmation

## 📋 What Each File Does

### Backend Files

| File | Purpose |
|------|---------|
| `backend/models/Complaint.js` | Database schema - now includes complaintId, fullName, phone |
| `backend/controllers/complaintController.js` | API logic - generates unique complaint IDs |
| `backend/routes/complaintRoutes.js` | Already configured, no changes needed |

### Frontend Files

| File | Purpose |
|------|---------|
| `frontend/src/services/emailjsClient.js` | EmailJS sender - `sendComplaintConfirmation()` function |
| `frontend/src/components/ComplaintForm.jsx` | Form UI - enhanced with EmailJS integration |

## 🎯 Feature Workflow

```
User fills form and clicks Submit
         ↓
Client validates inputs
         ↓
POST to /api/complaints (backend)
         ↓
Backend generates: CIV-123456
         ↓
Complaint saved to database
         ↓
Response returns complaint data
         ↓
Frontend calls EmailJS: sendComplaintConfirmation()
         ↓
Email sent to user
         ↓
Show success message with Complaint ID to user
```

## 📧 Email Variables

Your email template can use these:
- `{{to_email}}` - User's email address
- `{{name}}` - User's full name
- `{{complaint_id}}` - Complaint ID (CIV-XXXXXX)
- `{{category}}` - Complaint category (e.g., Roads & Potholes)

## ⚠️ Important Notes

1. **Email fails but complaint succeeds?**
   - This is by design! Shows warning to user
   - Complaint is still saved to database
   - User can track it using complaint ID

2. **Format of Complaint ID?**
   - Always: `CIV-` + 6 random digits
   - Examples: `CIV-000001`, `CIV-999999`, `CIV-123456`

3. **Free EmailJS Plan?**
   - 200 emails/month included
   - Perfect for testing & small deployments
   - Upgrade to paid for higher limits

4. **Environment Variables?**
   - Never commit `.env` to Git!
   - Keep security keys private
   - Add `.env` to `.gitignore`

## 🔍 Debugging

### Check if EmailJS is configured:
Open browser console (F12 → Console tab), should see:
```
EmailJS config: {
  SERVICE_ID: "service_xxxxx",
  TEMPLATE_ID: "template_xxxxx", 
  PUBLIC_KEY: "***present***"
}
```

### Check complaint was saved:
Backend console should show:
```
POST /api/complaints
Generated ID: CIV-123456
Complaint saved successfully
```

### Check email was sent:
Browser console should show:
```
sendComplaintConfirmation called with: {...}
sendComplaintConfirmation success: {...}
```

## 📞 Support Resources

- **EmailJS Docs:** https://www.emailjs.com/docs/
- **Your Setup Guide:** See `EMAILJS_SETUP.md`
- **Implementation Details:** See `COMPLAINT_FEATURE_IMPLEMENTATION.md`

## ✨ What's Next (Optional)

After testing, you can:
- [ ] Add email templates with branding
- [ ] Send admin notifications
- [ ] Create complaint tracking page
- [ ] Add SMS notifications
- [ ] Implement multi-language support
- [ ] Add social sharing
- [ ] Create analytics dashboard

---

**Need help?** Check the console logs first - they tell you exactly what's happening!
