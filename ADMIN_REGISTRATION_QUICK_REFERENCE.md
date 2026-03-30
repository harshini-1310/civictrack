# Admin Registration Quick Reference

## 🚀 Quick Start

### 1. Set Admin Code (Backend)
Edit `backend/.env`:
```env
ADMIN_SECRET_CODE=citizen_admin_2024
```

### 2. Start Services
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend && npm start

# Terminal 3: Frontend
cd frontend && npm run dev
```

### 3. Register Admin
1. Go to `http://localhost:5176`
2. Click "Admin Login" → "Register"
3. Fill in form:
   - Username: Your preferred username
   - Password: Your secure password
   - Admin Code: `citizen_admin_2024`
4. Click "Create Account"

### 4. Login
Use your credentials to login and access dashboard

---

## 🔐 Security Checklist

- [ ] Changed `ADMIN_SECRET_CODE` in `.env` (production)
- [ ] Using strong admin code (uppercase, lowercase, numbers, symbols)
- [ ] Admin code stored in `.env` (never in code)
- [ ] MongoDB running (`mongod`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5176
- [ ] JWT secret changed in `.env` (production)

---

## 📡 API Quick Reference

### Register Admin
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_secure_password",
  "adminCode": "citizen_admin_2024"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_secure_password"
}
```

### Get Current Admin
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 📋 Default Credentials (Testing Only)

| Field | Value |
|-------|-------|
| Admin Code | `citizen_admin_2024` (from `.env`) |
| Username | Create your own (min. 3 characters) |
| Password | Create your own (min. 6 characters) |

**⚠️ Change these in production!**

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid admin code" | Check code in `.env` matches what you entered |
| "Cannot connect to MongoDB" | Run `mongod` in terminal |
| "Cannot POST /api/auth/register" | Ensure backend is running on port 5000 |
| "401 Unauthorized" | Login again to get new token |
| "Username already exists" | Choose different username |

---

## 📁 File Changes Summary

✅ `backend/.env` - Added ADMIN_SECRET_CODE
✅ `backend/controllers/authController.js` - Added admin code validation
✅ `frontend/src/pages/AdminLogin.jsx` - Added admin code field to form

---

## 🔄 Full Workflow

```
User Opens App
    ↓
Click "Admin Login"
    ↓
New User? Click "Register"
    ↓
Fill Form (username, password, admin code)
    ↓
Submit Registration
    ↓
Backend validates admin code
    ├─ Valid? → Create user, return token
    └─ Invalid? → Return error
    ↓
Frontend stores token in localStorage
    ↓
Redirect to Admin Dashboard
    ↓
Access Protected Routes with JWT Token
```

---

## 🎯 Key Points

1. **Admin code is mandatory** for registration - prevents unauthorized admins
2. **Passwords are hashed** with bcrypt - never stored in plain text
3. **JWT tokens expire** after 7 days - users must login again
4. **Only one admin code** needed - same code used by all new admins
5. **Backend validates** everything - frontend validation is just UX

---

**Version**: 1.0.0 | **Date**: March 29, 2026
