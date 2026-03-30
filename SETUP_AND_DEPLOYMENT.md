# Citizen Connect - Complete Setup & Deployment Guide

**Version**: 1.0.0  
**Date**: March 29, 2026  
**Feature**: Secure Admin Registration with Admin Code

---

## 🎯 Overview

Citizen Connect is a full-stack web application that allows citizens to report public issues and enables administrators to manage and resolve them. This guide covers the complete setup, configuration, and deployment.

---

## ⚙️ Prerequisites

### System Requirements
- Node.js 16+ (`node --version`)
- MongoDB 4.0+ (local or remote)
- Windows/Mac/Linux
- Terminal/Command Prompt

### Installation Verification
```bash
# Check Node.js
node --version
npm --version

# Check MongoDB (should return version)
mongod --version
```

---

## 📦 Project Structure

```
citizen-connect/
├── backend/                    # Express + MongoDB server
│   ├── models/                 # Database schemas
│   ├── controllers/            # Business logic
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Authentication
│   ├── .env                    # Configuration
│   ├── package.json            # Dependencies
│   └── server.js               # Entry point
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # UI components
│   │   ├── services/           # API client
│   │   ├── index.css           # Tailwind styles
│   │   └── App.jsx             # Main app
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite config
│   └── tailwind.config.js      # Tailwind config
│
└── Documentation/
    ├── ADMIN_REGISTRATION_GUIDE.md
    ├── ADMIN_REGISTRATION_QUICK_REFERENCE.md
    ├── IMPLEMENTATION_ADMIN_REGISTRATION.md
    └── SETUP_AND_DEPLOYMENT.md (this file)
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

**Backend**:
```bash
cd backend
npm install
```

**Frontend**:
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

#### Backend Configuration
Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/citizen-connect
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_SECRET_CODE=citizen_admin_2024
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
PORT=5000
NODE_ENV=development
```

### Step 3: Start Services

**Terminal 1 - MongoDB**:
```bash
mongod
```
Expected output: `waiting for connections on port 27017`

**Terminal 2 - Backend**:
```bash
cd backend
npm start
```
Expected output:
```
✓ Server running on port 5000
✓ MongoDB connected successfully
```

**Terminal 3 - Frontend**:
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v8.0.3  ready in 980 ms
Local: http://localhost:5176/
```

### Step 4: Open Application

Open browser: **http://localhost:5176**

---

## 🔐 Admin Registration Setup

### Step 1: Access Registration Page

1. Open `http://localhost:5176`
2. Click **"🔐 Admin Login"** in header
3. Click **"Register"** link

### Step 2: Create Admin Account

Fill in the form with your own credentials:
- **Username**: Your preferred username (min. 3 characters, must be unique)
- **Password**: Your strong password (min. 6 characters)  
- **Admin Code**: `citizen_admin_2024` (from `.env`)

### Step 3: Complete Registration

1. Click **"✓ Create Account"**
2. You'll be automatically logged in
3. Redirected to Admin Dashboard

### Step 4: Login on Next Visit

1. Click **"🔐 Admin Login"**
2. Enter username and password
3. Click **"📝 Login"**

---

## 📋 API Endpoints Reference

### Authentication (PUBLIC)

#### Register Admin
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_secure_password",
  "adminCode": "citizen_admin_2024"
}
```

**Responses**:
- `201`: Admin registered successfully (returns token)
- `400`: Missing fields or username exists
- `403`: Invalid admin code

#### Login Admin
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_secure_password"
}
```

**Responses**:
- `200`: Logged in successfully (returns token)
- `401`: Invalid credentials

### Complaints (PUBLIC)

#### Submit Complaint
```
POST /api/complaints
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic hazard",
  "category": "Road Damage",
  "severity": "high",
  "location": "Main Street, Downtown",
  "email": "citizen@example.com"
}
```

**Responses**:
- `201`: Complaint created successfully
- `400`: Missing or invalid fields

#### Get All Complaints
```
GET /api/complaints
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "stats": {
    "total": 10,
    "pending": 7,
    "resolved": 3,
    "emergencies": 1
  }
}
```

### Admin Routes (PROTECTED - Requires JWT Token)

#### Get Current Admin
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Complaint Status
```
PUT /api/complaints/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Resolved",
  "resolutionNotes": "Fixed the pothole"
}
```

**Response**: `200 OK` with updated complaint

---

## 🔒 Security Configuration

### For Development

**backend/.env** (minimal):
```env
MONGODB_URI=mongodb://localhost:27017/citizen-connect
JWT_SECRET=dev_secret_key
ADMIN_SECRET_CODE=citizen_admin_2024
PORT=5000
NODE_ENV=development
```

### For Production

**backend/.env** (production):
```env
MONGODB_URI=mongodb+srv://user:password@mydb.mongodb.net/citizen-connect
JWT_SECRET=use_strong_random_string_here_min_32_chars
ADMIN_SECRET_CODE=use_very_strong_random_code_here
EMAIL_USER=notification@company.com
EMAIL_PASSWORD=your_app_specific_password
PORT=5000
NODE_ENV=production
```

**Security Steps**:
1. [ ] Change `ADMIN_SECRET_CODE` to strong random value
2. [ ] Change `JWT_SECRET` to strong random value
3. [ ] Use MongoDB Atlas for production database
4. [ ] Configure real email service credentials
5. [ ] Never commit `.env` file to git
6. [ ] Add `.env` to `.gitignore`
7. [ ] Enable HTTPS (use SSL certificate)
8. [ ] Set `NODE_ENV=production` on production server

---

## 🗄️ Database Management

### MongoDB Commands

```bash
# Start MongoDB
mongod

# Connect to database
mongo

# Use citizen-connect database
use citizen-connect

# View all admins
db.admins.find()

# View all complaints
db.complaints.find()

# Delete admin (if needed) - replace "your_username" with the actual username
db.admins.deleteOne({ username: "your_username" })

# Clear all complaints
db.complaints.deleteMany({})

# View database statistics
db.stats()
```

### MongoDB Atlas (Cloud)

1. Create account at `https://www.mongodb.com/cloud/atlas`
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/citizen-connect
   ```

---

## 🧪 Testing the Application

### Test Case 1: Citizen Reports Issue

1. Open `http://localhost:5176`
2. Click **"📝 Report an Issue"**
3. Fill in complaint form:
   - Title: "Broken Streetlight"
   - Description: "Streetlight not working"
   - Category: "Lighting"
   - Severity: "High"
   - Location: "5th Ave & Main St"
   - Email: "test@example.com"
4. Click **"✓ Submit Complaint"**
5. Success message appears

### Test Case 2: Admin Dashboard

1. Go to Admin Login
2. Register new admin (with admin code)
3. View complaints on dashboard
4. Search by status/severity
5. Click complaint to expand details
6. Click **"✓ Resolve"**
7. Enter resolution notes
8. Verify complaint status changed to "Resolved"

### Test Case 3: Failed Registration (No Admin Code)

1. Go to Admin Login → Register
2. Fill form WITHOUT admin code
3. Click Create Account
4. Should see error: "Please provide username, password, and admin code"

### Test Case 4: Failed Registration (Wrong Admin Code)

1. Go to Admin Login → Register
2. Fill form with wrong code (e.g., "wrongcode")
3. Click Create Account
4. Should see error: "Invalid admin code. Registration failed."

---

## 🐛 Troubleshooting

### Issue: Cannot Connect to MongoDB

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Make sure MongoDB is running
mongod

# If mongod is not installed, install it
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

### Issue: Port Already in Use

**Error**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000  (Windows)
lsof -i :5000                  (Mac/Linux)

# Kill the process
taskkill /PID <PID> /F         (Windows)
kill -9 <PID>                  (Mac/Linux)
```

### Issue: "Invalid Admin Code" During Registration

**Solution**:
1. Verify admin code in `backend/.env`
2. Make sure backend is running (`npm start`)
3. Check for typos (case-sensitive)
4. Restart backend after changing `.env`

### Issue: Token Expired or Unauthorized

**Error**: `401 Unauthorized`

**Solution**:
1. Clear browser cookies/localStorage
2. Logout and login again
3. Refresh page to get new token

### Issue: Frontend Cannot Connect to Backend

**Error**: `Cannot GET /api/complaints` or CORS error

**Solution**:
1. Make sure backend is running on port 5000
2. Check that both services are running:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5176`
3. Check browser DevTools → Network tab for failed requests

### Issue: Tailwind CSS Not Working

**Error**: Classes like `btn-primary` not applying

**Solution**:
1. Make sure you're in frontend folder
2. Run: `npm install`
3. Run: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart frontend dev server

---

## 📦 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create citizen-connect

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set ADMIN_SECRET_CODE=your_admin_code

# Deploy backend
git push heroku main

# Monitor logs
heroku logs --tail
```

### Deploy to AWS

1. Use EC2 for backend (Node.js)
2. Use S3/CloudFront for frontend (static files)
3. Use RDS or MongoDB Atlas for database
4. Use ALB for load balancing

### Deploy to DigitalOcean

1. Create Droplet (Ubuntu 20.04+)
2. Install Node.js and MongoDB
3. Clone repository
4. Run `npm install` in both folders
5. Use PM2 for process management
6. Configure Nginx as reverse proxy
7. Enable SSL with Let's Encrypt

### Deploy to Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

---

## 📊 Performance Optimization

### Frontend Optimization

```bash
# Build for production
cd frontend
npm run build

# Output in dist/ folder - ready for deployment
```

### Backend Optimization

1. Enable compression:
   ```javascript
   app.use(compression());
   ```

2. Add caching headers
3. Use connection pooling for MongoDB
4. Add environment-specific logging

### Database Optimization

1. Create indexes on frequently queried fields
2. Archive old complaints
3. Monitor query performance
4. Regular backups

---

## 🔄 Maintenance Tasks

### Daily
- Monitor error logs
- Check server health
- Monitor database size

### Weekly
- Review complaint statistics
- Check for unusual activity
- Backup database

### Monthly
- Update dependencies: `npm update`
- Review security logs
- Performance analysis
- User feedback review

---

## 📞 Support

### Getting Help

1. **Check Documentation**
   - `ADMIN_REGISTRATION_GUIDE.md`
   - `ADMIN_REGISTRATION_QUICK_REFERENCE.md`

2. **Check Error Messages**
   - Browser console (F12)
   - Backend terminal output
   - MongoDB logs

3. **Common Issues**
   - See Troubleshooting section above

---

## 📝 License & Credits

**Project**: Citizen Connect  
**Version**: 1.0.0  
**Created**: March 29, 2026  
**Type**: Full-Stack Web Application  

**Technology Stack**:
- Frontend: React 19, Vite, Tailwind CSS
- Backend: Express, MongoDB, Mongoose
- Auth: JWT, Bcrypt
- Email: Nodemailer

---

## ✅ Pre-Launch Checklist

- [ ] MongoDB running locally or connection string set
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` files configured properly
- [ ] Admin code set and secured
- [ ] JWT secret changed from default
- [ ] Backend starts without errors (`npm start`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access app at `http://localhost:5176`
- [ ] Admin registration working
- [ ] Admin login working
- [ ] Can submit complaint as citizen
- [ ] Can resolve complaint as admin
- [ ] All tests passing
- [ ] Documentation reviewed

---

## 🎉 You're Ready!

Your Citizen Connect application is now complete and ready to use. Follow this guide for smooth setup and deployment.

**Questions?** Check the documentation files or review the error messages in the terminal/browser console.

**Happy deploying! 🚀**

