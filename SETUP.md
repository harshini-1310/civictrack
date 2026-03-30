# 🚀 Quick Start Guide - Citizen Connect

## Prerequisites
- Node.js v14+ installed
- MongoDB installed and running OR MongoDB Atlas account
- npm or yarn

## 5-Minute Setup

### Step 1: Start MongoDB
**If using local MongoDB:**
```bash
# Open a new terminal/cmd and run:
mongod
```

**If using MongoDB Atlas:**
- Already configured and running in the cloud

### Step 2: Start Backend

```bash
# Open terminal from project root
cd backend

# Install dependencies (if not already done)
npm install

# Start server
npm start

# ✅ You should see:
# ✓ MongoDB connected successfully
# ✓ Server running on port 5000
```

**Backend is ready at:** http://localhost:5000
**Health check:** http://localhost:5000/api/health

### Step 3: Start Frontend

```bash
# Open NEW terminal from project root
cd frontend

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# ✅ You should see:
# VITE v5.0.0 ready in XXX ms
# Local: http://localhost:5173
```

**Frontend is ready at:** http://localhost:5173

---

## 🧪 Testing the Application

### Step 1: Report a Complaint (as Citizen)
1. Go to http://localhost:5173
2. Fill out the complaint form:
   - Title: "Broken streetlight near Park Avenue"
   - Description: "The streetlight has been off for 3 days"
   - Category: "Electricity"
   - Severity: "Medium"
   - Location: "Park Avenue, Downtown"
   - Email: "citizen@example.com" (optional)
3. Click "Submit Complaint"
4. ✅ You should see success message

### Step 2: Login as Admin
1. Go to http://localhost:5173/admin-login
2. Click "Register" to create admin account
3. Enter credentials:
   - Username: Your preferred username
   - Password: Your secure password
4. Click "Create Account"
5. ✅ You should be redirected to dashboard

### Step 3: View Dashboard
1. Admin dashboard shows:
   - ✅ Summary cards with statistics
   - ✅ Your complaint displayed as a card
   - ✅ Filters and search available

### Step 4: Resolve a Complaint
1. Click the complaint card to expand it
2. Click "Mark as Resolved"
3. Add resolution notes: "Fixed the streetlight"
4. Click "Confirm Resolution"
5. ✅ Complaint status changes to "Resolved"
6. 📧 Email notification sent to citizen (if email configured)

---

## ⚙️ Configuration

### Email Setup (Optional)
To enable email notifications:

1. **Get Gmail App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select Mail → Windows Computer
   - Generate 16-character password

2. **Update backend/.env:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. **Restart backend**

### Database Setup (MongoDB Atlas)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update backend/.env:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/citizen-connect
   ```

---

## 📊 API Quick Test

### Test Creating Complaint
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "description": "Testing the API",
    "category": "Road",
    "severity": "Low",
    "location": "Test Street",
    "email": "test@example.com"
  }'
```

### Test Getting Complaints (Admin)
```bash
# First, get auth token by logging in:
# Then use the token:
curl http://localhost:5000/api/complaints \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **MongoDB connection failed** | Start mongod or check Atlas connection string |
| **Port 5000 already in use** | Change PORT in backend/.env |
| **CORS errors** | Ensure both servers are running |
| **Login not working** | Register a new admin account first |
| **Emails not sending** | Check EMAIL_USER and EMAIL_PASSWORD in .env |

---

## 📁 Project Structure Quick Reference

```
citizen-connect/
├── backend/
│   ├── server.js ...................... Main Express server
│   ├── routes/ ........................ API endpoints
│   ├── controllers/ ................... Business logic
│   ├── models/ ........................ Database schemas
│   ├── middleware/auth.js ............ JWT verification
│   └── .env ........................... Configuration
│
└── frontend/
    ├── src/
    │   ├── App.jsx .................... Main app with routing
    │   ├── pages/ ..................... Page components
    │   ├── components/ ............... Reusable components
    │   ├── services/axiosClient.js ... API client
    │   └── index.css .................. Tailwind styles
    └── .env ........................... API URL config
```

---

## 🎯 Key Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/complaints` | Create complaint (public) |
| GET | `/api/complaints` | Get all complaints (admin) |
| PUT | `/api/complaints/:id` | Update complaint status (admin) |
| POST | `/api/auth/register` | Register admin |
| POST | `/api/auth/login` | Login admin |

---

## 🎨 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Citizen complaint form |
| Admin Login | `/admin-login` | Admin auth |
| Dashboard | `/admin-dashboard` | Admin management panel |

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend server started (port 5000)
- [ ] Frontend dev server started (port 5173)
- [ ] Can access http://localhost:5173 in browser
- [ ] Can submit a complaint
- [ ] Can register and login as admin
- [ ] Can see complaints in dashboard
- [ ] Can mark complaint as resolved

---

## 📚 Additional Resources

- [MongoDB Docs](https://docs.mongodb.com/)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

---

**🎉 You're all set! Start exploring Citizen Connect!**

For detailed information, see [README.md](./README.md)
