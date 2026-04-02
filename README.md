# 🏛️ CivicTrack - Admin Registration System

**Full-Stack Web Application for Public Issue Reporting**

A complete web application that allows citizens to report public issues (potholes, broken lights, etc.) and enables administrators to securely manage and resolve them. Now with **secure admin registration system** requiring secret admin code.

**Version**: 1.0.0  |  **Status**: ✅ Complete & Production Ready  |  **Date**: March 29, 2026

---

## 🎯 Features

### For Citizens
- 📋 **Submit Complaints**: Report public issues with details (title, description, category, severity, location, email)
- 🔔 **Track Status**: View complaint status in real-time (pending/resolved)
- 📊 **Categories**: Road, Electricity, Drainage, Lighting, and Other
- 🚨 **Severity Levels**: Low, Medium, High, Emergency
- 📬 **Email Updates**: Receive notification when complaint is resolved

### For Administrators
- 🔐 **Secure Registration** ⭐ NEW: Register with secret admin code
- 🔑 **Secure Login**: JWT-based authentication with token management  
- 📊 **Dashboard**: View all complaints with real-time statistics
- 🔍 **Advanced Filters**: Filter by status, severity, search by text
- ✅ **Resolve Complaints**: Mark as resolved and add resolution notes
- 📈 **Analytics**: Track total, pending, resolved, and emergency complaints
- 📧 **Email Notifications**: Notify citizens when complaint is resolved

---

## ⭐ What's New - Secure Admin Registration

### Admin Code Protection
- ✅ **Secret Admin Code Required**: Only authorized users can create admin accounts
- ✅ **Server-Side Validation**: Code verified on backend (secure, cannot bypass)
- ✅ **Environment Configuration**: Admin code stored in `.env`
- ✅ **Error Protection**: Generic error messages prevent code guessing

### Implementation
- Backend: Admin code validation in registration endpoint
- Frontend: Admin code input field (only in register mode)
- Configuration: `ADMIN_SECRET_CODE` in `.env`
- Security: Passwords hashed with bcrypt, tokens with 7-day expiry

---

## 🚀 Quick Start

### Prerequisites
```bash
# Check versions installed
node --version      # Should be 16+
mongod --version    # Should be 4.0+
```

### Start Application (3 Commands)

**Terminal 1: Start MongoDB**
```bash
mongod
```

**Terminal 2: Start Backend**
```bash
cd backend
npm install
npm start

# Expected: ✓ Server running on port 5000
#           ✓ MongoDB connected successfully
```

**Terminal 3: Start Frontend**
```bash
cd frontend
npm install
npm run dev

# Expected: Local: http://localhost:5176/
```

### Access Application
```
Open: http://localhost:5176
```

### Register Admin Account

1. Click **"🔐 Admin Login"** button
2. Click **"Register"** link
3. Fill registration form with your own credentials:
   - **Username**: Your preferred username (min. 3 characters)
   - **Password**: Your secure password (min. 6 characters)
   - **Admin Code**: `citizen_admin_2024` (from `.env`)
4. Click **"✓ Create Account"**
5. ✅ Logged in to admin dashboard!

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.4 with Vite
- **Tailwind CSS** 4.2.2 with custom utilities
- **React Router** 7.13.2 for navigation
- **Axios** 1.14.0 with JWT interceptor

### Backend
- **Express** 5.2.1 HTTP framework
- **MongoDB** with Mongoose 9.3.3 ODM
- **JWT** 9.0.0 token authentication
- **Bcryptjs** 2.4.3 password hashing

### Frontend Email Service
- **EmailJS** for automated email notifications

### Database
- **MongoDB** local (`localhost:27017`) or MongoDB Atlas

---

## 📁 Project Structure

```
citizen-connect/
├── backend/
│   ├── models/
│   │   ├── Complaint.js             # Complaint schema
│   │   └── Admin.js                 # Admin schema with password hashing
│   ├── controllers/
│   │   ├── complaintController.js   # CRUD + email logic
│   │   └── authController.js        # Register, login, JWT generation
│   ├── routes/
│   │   ├── complaintRoutes.js       # Complaint endpoints
│   │   └── authRoutes.js            # Auth endpoints
│   ├── middleware/
│   │   └── auth.js                  # JWT token verification
│   ├── .env                         # Configuration (ADMIN_SECRET_CODE)
│   ├── server.js                    # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Citizen complaint form
│   │   │   ├── AdminLogin.jsx       # Admin login/register (updated)
│   │   │   └── AdminDashboard.jsx   # Admin dashboard
│   │   ├── components/
│   │   │   ├── Header.jsx           # Navigation
│   │   │   ├── Footer.jsx           # Footer
│   │   │   ├── ComplaintForm.jsx    # Citizen form
│   │   │   └── ComplaintCard.jsx    # Complaint display
│   │   ├── services/
│   │   │   └── axiosClient.js       # API client with JWT
│   │   ├── App.jsx                  # Main router
│   │   └── index.css                # Tailwind CSS (v4 compatible)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── Documentation/
    ├── README.md                           # This file
    ├── COMPLETE_SUMMARY.md                 # Project overview
    ├── NEXT_STEPS_CHECKLIST.md            # Step-by-step guide
    ├── ADMIN_REGISTRATION_GUIDE.md        # Full reference
    ├── ADMIN_REGISTRATION_QUICK_REFERENCE.md
    ├── CODE_CHANGES_SUMMARY.md            # Before/after code
    ├── SETUP_AND_DEPLOYMENT.md            # Deployment guide
    └── IMPLEMENTATION_ADMIN_REGISTRATION.md
│   ├── server.js             # Main server file
│   ├── package.json
│   └── .env                  # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ComplaintForm.jsx
    │   │   └── ComplaintCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx       # Citizen form page
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── axiosClient.js # API client
    │   ├── App.jsx            # Main app with routing
    │   ├── index.css          # Tailwind styles
    │   └── main.jsx
    ├── package.json
    ├── .env                   # Frontend env vars
    └── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**
- **Gmail Account** (for email notifications - optional)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update MongoDB URI:
     ```
     MONGODB_URI=mongodb://localhost:27017/citizen-connect
     ```
   - Update JWT Secret (change in production):
     ```
     JWT_SECRET=your-secret-key
     ```
   - EmailJS is configured on the frontend (no backend email config needed)
   - Set PORT (default 5000):
     ```
     PORT=5000
     ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   - Server will run on `http://localhost:5000`
   - Check health: `http://localhost:5000/api/health`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Check `.env` file
   - Update API URL if backend runs on different port:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```
   - Add EmailJS credentials (for email notifications):
     ```
     VITE_EMAILJS_SERVICE_ID=service_xxxxx
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     VITE_EMAILJS_TEMPLATE_SUBMITTED=template_xxxxx
     VITE_EMAILJS_TEMPLATE_RESOLVED=template_yyyyy
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   - Frontend will run on `http://localhost:5173`

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

**Register Admin (First time)**
```
POST /auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "admin": { "id": "...", "username": "admin" }
}
```

**Login Admin**
```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "admin": { "id": "...", "username": "admin" }
}
```

### Complaint Endpoints

**Create Complaint (Public)**
```
POST /complaints
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole near the intersection",
  "category": "Road",
  "severity": "Medium",
  "location": "Main Street, Downtown",
  "email": "citizen@example.com"
}

Response:
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": { ... }
}
```

**Get All Complaints (Admin only)**
```
GET /complaints
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [ ... ],
  "summary": {
    "total": 10,
    "resolved": 5,
    "pending": 5,
    "bySeverity": { "low": 2, "medium": 5, "high": 2, "emergency": 1 }
  }
}
```

**Update Complaint Status (Admin only)**
```
PUT /complaints/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Resolved",
  "resolutionNotes": "Issue has been fixed"
}

Response:
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": { ... }
}
```

## 🔑 How to Use

### For Citizens

1. **Open Home Page**: Navigate to `http://localhost:5173`
2. **Fill the Complaint Form**:
   - Enter complaint title
   - Provide detailed description
   - Select category and severity
   - Provide location
   - (Optional) Add email for notifications
3. **Submit**: Click "Submit Complaint"
4. **Receive Confirmation**: Success message displays
5. **Get Notified**: When admin resolves your issue, receive email notification

### For Administrators

1. **Register/Login**:
   - First time: Click "Register" and create admin account
   - After: Click "Admin Login" with credentials

2. **View Dashboard**:
   - See summary cards with stats
   - View all complaints as cards

3. **Manage Complaints**:
   - Click complaint card to expand details
   - Use filters to find specific complaints
   - Use search to locate issues
   - Click "Mark as Resolved" to resolve
   - Add resolution notes and confirm
   - Citizen receives email notification

4. **Track Progress**:
   - Monitor total, pending, and resolved counts
   - Check severity distribution
   - Use filters/search for quick access

## 📧 Email Configuration with EmailJS

To enable email notifications:

1. **Register with EmailJS**:
   - Go to: https://www.emailjs.com/
   - Click "Sign Up Free"
   - Complete signup and verify your email

2. **Set Up Email Service**:
   - Login to EmailJS dashboard
   - Go to "Email Services" → "Add New Service"
   - Select your email provider (Gmail, Outlook, etc.)
   - Connect your email account
   - Copy your **Service ID** (format: `service_xxxxx`)

3. **Create Email Templates**:
   - Go to "Email Templates" → "Create New Template"
   - Create two templates: one for complaint submission, one for resolution
   - Use variables like `{{name}}`, `{{complaint_id}}`, `{{email}}`
   - Copy template IDs (format: `template_xxxxx`)

4. **Get API Credentials**:
   - Go to "Account" → "API Keys"
   - Copy your **Public Key**

5. **Update Frontend .env**:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxx
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_TEMPLATE_SUBMITTED=template_xxxxx
   VITE_EMAILJS_TEMPLATE_RESOLVED=template_yyyyy
   ```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected admin routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variables for sensitive data

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running
- For local: mongod
- For Atlas: Check connection string in .env
```

### CORS Error
```
Solution: Check backend CORS configuration
- Frontend and backend must be on allowed origins
- Check server.js for CORS setup
```

### Email Not Sending
```
Solution:
1. Check all EmailJS environment variables in frontend/.env
2. Verify Service ID and Template IDs are correct
3. Ensure Public Key is valid in EmailJS dashboard
4. Check spam folder for received emails
5. Review EmailJS dashboard for failed email logs
```

### JWT Token Errors
```
Solution:
1. Clear localStorage in browser
2. Re-login to get new token
3. Check JWT_SECRET in .env matches between requests
```

## 📦 Build & Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Deploy 'dist' folder to your hosting service
```

## 📝 Database Schema

### Complaint Model
```javascript
{
  title: String,
  description: String,
  category: String (Road|Electricity|Drainage|Other),
  severity: String (Low|Medium|High|Emergency),
  location: String,
  email: String,
  status: String (Pending|Resolved),
  resolutionNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  username: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

## ⭐ Admin Registration System (NEW!)

### Secure Registration with Admin Code

The application now includes a secure admin registration system that requires a secret admin code to create new admin accounts.

#### Registration Process

1. Click **"🔐 Admin Login"** in the header
2. Click **"Register"** link
3. Fill in the form:
   - **Username**: Choose unique username
   - **Password**: Choose strong password (min. 6 characters)
   - **Admin Code**: Enter the secret admin code
4. Click **"✓ Create Account"**
5. Token automatically stored and redirected to dashboard

#### Default Admin Code
```
citizen_admin_2024
```

Change this in `backend/.env` for production!

#### Security Features

- ✅ **Server-Side Validation**: Code verified on backend only
- ✅ **Environment Variables**: Code stored in `.env`
- ✅ **Password Hashing**: Bcrypt with 10 salt rounds
- ✅ **JWT Tokens**: 7-day expiry, secure signing
- ✅ **Generic Error Messages**: Prevents code guessing

#### API Endpoint

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_secure_password",
  "adminCode": "citizen_admin_2024"
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "username": "your_username"
  }
}
```

**Response (Invalid Code - 403)**:
```json
{
  "success": false,
  "message": "Invalid admin code. Registration failed."
}
```

---

## 📚 Comprehensive Documentation

This project includes 7 comprehensive documentation files to help you get started:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **COMPLETE_SUMMARY.md** | Full project overview and status | 5 min |
| **NEXT_STEPS_CHECKLIST.md** | Step-by-step setup guide | 10 min |
| **ADMIN_REGISTRATION_QUICK_REFERENCE.md** | Quick lookup & commands | 2 min |
| **ADMIN_REGISTRATION_GUIDE.md** | Complete reference with API docs | 20 min |
| **CODE_CHANGES_SUMMARY.md** | Before/after code comparison | 15 min |
| **SETUP_AND_DEPLOYMENT.md** | Deployment to production | 25 min |
| **IMPLEMENTATION_ADMIN_REGISTRATION.md** | Technical implementation details | 20 min |

### Where to Start

1. **First Time?** Read `COMPLETE_SUMMARY.md`
2. **Ready to Run?** Follow `NEXT_STEPS_CHECKLIST.md`
3. **Need Details?** Check `ADMIN_REGISTRATION_GUIDE.md`
4. **Want Code Details?** See `CODE_CHANGES_SUMMARY.md`

---

## 🔧 Configuration Reference

### Backend Configuration (backend/.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/citizen-connect

# JWT Secret (change in production)
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Admin Secret Code (change in production!)
ADMIN_SECRET_CODE=citizen_admin_2024

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Note:** Email notifications are handled frontend-side using EmailJS, so no email configuration needed on backend.

### Frontend Configuration (frontend/.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_SUBMITTED=template_submitted_xxxxx
VITE_EMAILJS_TEMPLATE_RESOLVED=template_resolved_xxxxx
```

---

## 📊 API Quick Reference

### Authentication (Public)
- `POST /api/auth/register` - Register admin with code  ✨ NEW!
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin (protected)

### Complaints (Public & Protected)
- `GET /api/complaints` - View all complaints
- `POST /api/complaints` - Submit new complaint
- `PUT /api/complaints/:id` - Resolve complaint (protected)
- `GET /api/health` - Health check

---

## 🧪 Testing the Application

### Test Case 1: Citizen Submission
```
1. Open http://localhost:5176
2. Fill complaint form
3. Submit
4. See success message ✅
```

### Test Case 2: Admin Registration
```
1. Click "Admin Login" → "Register"
2. Use admin code: citizen_admin_2024
3. Create account ✅
4. Redirected to dashboard ✅
```

### Test Case 3: Admin Security
```
1. Try registration with wrong code
2. Get error: "Invalid admin code" ✅
3. Account NOT created ✅
```

### Test Case 4: Dashboard Functions
```
1. View all complaints ✅
2. Filter by status/severity ✅
3. Search by text ✅
4. Resolve complaint ✅
5. See updated status ✅
```

---

## 🚀 Ready to Deploy?

The application is production-ready for deployment to:

### Cloud Platforms
- ✅ Heroku
- ✅ DigitalOcean
- ✅ AWS (EC2 + RDS)
- ✅ Azure App Service
- ✅ Google Cloud Platform
- ✅ Render.com
- ✅ Vercel (frontend only)

### Before Deployment
1. [ ] Change `ADMIN_SECRET_CODE` to strong code
2. [ ] Change `JWT_SECRET` to random string
3. [ ] Add `.env` to `.gitignore`
4. [ ] Set `NODE_ENV=production`
5. [ ] Configure MongoDB Atlas
6. [ ] Set up email service
7. [ ] Enable HTTPS/SSL

See **SETUP_AND_DEPLOYMENT.md** for detailed deployment instructions.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💡 Future Enhancements

- 📱 Mobile app version (React Native)
- 🗺️ Google Maps integration
- 📸 Image/file uploads
- 💬 Real-time messaging (WebSocket)
- 📊 Advanced analytics & reports
- 🔔 Push notifications
- ⭐ Citizen rating system
- 🔐 Two-factor authentication
- 👥 Multi-level admin roles
- 📅 Complaint history & archives

---

## 🆘 Getting Help

### Documentation First
1. Check the relevant documentation file
2. Look for your issue in **NEXT_STEPS_CHECKLIST.md** → Troubleshooting
3. Review error messages in browser console (F12)
4. Check backend terminal output

### Common Issues

| Problem | Solution |
|---------|----------|
| MongoDB won't start | Run `mongod` or install MongoDB |
| Backend won't connect | Verify MongoDB running, check `.env` |
| Admin code rejected | Check code in `.env`, restart backend |
| Frontend errors | Clear cache, `npm install`, restart dev server |
| Email not working | Verify EmailJS config, check frontend `.env` vars, review EmailJS dashboard |

### Advanced Help

See **SETUP_AND_DEPLOYMENT.md** → Troubleshooting section for detailed solutions.

---

## 📈 Project Status

| Feature | Status | Details |
|---------|--------|---------|
| Backend Server | ✅ Complete | Express 5 with MongoDB |
| Citizen Complaints | ✅ Complete | Submit, view, track |
| Admin Registration | ✅ Complete | Secure with admin code |
| Admin Dashboard | ✅ Complete | View, filter, resolve |
| JWT Authentication | ✅ Complete | Secure token-based auth |
| Email Notifications | ✅ Complete | EmailJS integration |
| Documentation | ✅ Complete | 7 comprehensive guides |
| Security | ✅ Complete | Bcrypt + JWT + Validation |
| Deployment | ✅ Ready | Production-ready code |
| Testing | ✅ Ready | Manual & automated ready |

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.

**Special thanks to**:
- Express.js team
- React team
- MongoDB team
- Tailwind CSS community
- All open-source contributors

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Mar 29, 2026 | ✨ Initial release with secure admin registration |
| 0.9.0 | Mar 25, 2026 | Beta release |

---

## 📞 Support & Feedback

- 📧 Email: support@citizenconnect.io
- 🐛 Report bugs: GitHub Issues
- 💡 Feature requests: GitHub Discussions
- 📝 Documentation: See documentation files in project root

---

**Last Updated**: March 29, 2026  
**Status**: ✅ Production Ready  
**Version**: 1.0.0  

**Happy coding! 🚀**
