# Secure Admin Registration System Guide

## Overview

The Citizen Connect application now includes a **secure admin registration system** that requires a secret admin code to create new admin accounts. This prevents unauthorized users from becoming administrators.

---

## Features

✅ **Admin Code Validation** - Only users with the correct admin code can register
✅ **Password Security** - Passwords are hashed using bcrypt before storage
✅ **JWT Authentication** - Secure token-based authentication
✅ **Role-Based Access** - Protected routes require valid admin token

---

## Setup Instructions

### Step 1: Backend Configuration

1. Open `.env` file in the backend folder:
   ```
   backend/.env
   ```

2. Verify or update the admin secret code:
   ```env
   ADMIN_SECRET_CODE=citizen_admin_2024
   ```

   **Important**: Change this to a strong, secure code in production!

   ```env
   # Example: Strong admin code
   ADMIN_SECRET_CODE=MySecure#Admin@2024!Code
   ```

### Step 2: Start Backend Services

1. **Start MongoDB** (if not already running):
   ```bash
   mongod
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

   Expected output:
   ```
   ✓ Server running on port 5000
   ✓ MongoDB connected successfully
   ```

3. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

---

## API Endpoints

### 1. Admin Registration

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "username": "your_username",
  "password": "your_secure_password",
  "adminCode": "citizen_admin_2024"
}
```

**Success Response** (201 Created):
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

**Error Responses**:

- Invalid Admin Code (403 Forbidden):
  ```json
  {
    "success": false,
    "message": "Invalid admin code. Registration failed."
  }
  ```

- Username Already Exists (400 Bad Request):
  ```json
  {
    "success": false,
    "message": "Admin with this username already exists"
  }
  ```

- Missing Fields (400 Bad Request):
  ```json
  {
    "success": false,
    "message": "Please provide username, password, and admin code"
  }
  ```

### 2. Admin Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "username": "your_username",
  "password": "your_secure_password"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "username": "your_username"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 3. Get Current Admin

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "your_username",
    "createdAt": "2024-03-29T10:30:00.000Z"
  }
}
```

---

## Frontend Usage

### Register as Admin

1. Open the application: `http://localhost:5176`
2. Click **"🔐 Admin Login"** in the header
3. Click **"Register"** link at the bottom
4. Fill in the form with your own credentials:
   - **Username**: Your preferred username (min. 3 characters, must be unique)
   - **Password**: Your strong password (min. 6 characters)
   - **Admin Code**: Enter the secret admin code from your system administrator
5. Click **"✓ Create Account"**
6. You'll be automatically logged in and redirected to the admin dashboard

### Login as Admin

1. Open the application: `http://localhost:5176`
2. Click **"🔐 Admin Login"** in the header
3. Enter your credentials:
   - **Username**: Your admin username
   - **Password**: Your admin password
4. Click **"📝 Login"**
5. You'll be redirected to the admin dashboard

---

## Security Best Practices

### 1. Admin Code Management

✅ **DO**:
- Store the admin code in `.env` file (never in code)
- Use a strong, complex admin code
- Change the admin code regularly in production
- Keep the admin code secret

❌ **DON'T**:
- Expose the admin code in frontend code
- Share the admin code via email or chat
- Use simple codes like "123456" or "admin"
- Display the actual admin code in error messages

### 2. Password Security

✅ **DO**:
- Use strong passwords (uppercase, lowercase, numbers, symbols)
- Never share your admin password
- Change password regularly
- Use unique passwords for different accounts

### 3. Token Security

✅ **DO**:
- Store JWT token in `localStorage` (handled by app)
- Token expires after 7 days
- Logout to clear the token from browser
- Never share your token with others

❌ **DON'T**:
- Store tokens in plain text files
- Commit `.env` files to version control
- Share tokens via email or chat

### 4. Database Security

✅ **Passwords are hashed** using bcrypt with 10 salt rounds
✅ **Plain text passwords never stored** in database
✅ **Field selection** prevents password leaks in queries

---

## Environment Variables Reference

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/citizen-connect

# JWT Secret (Change this in production!)
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Admin Secret Code (Required for registration - KEEP THIS SECURE!)
ADMIN_SECRET_CODE=citizen_admin_2024

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## Database Schema

### Admin Collection

```javascript
{
  _id: ObjectId,
  username: String,        // Unique, required (3-50 chars)
  password: String,        // Hashed before storage, required (6+ chars)
  createdAt: Date,         // Automatically set
  updatedAt: Date          // Automatically updated
}
```

**Example Document**:
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "your_username",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/1Pq",
  "createdAt": ISODate("2024-03-29T10:30:00.000Z"),
  "updatedAt": ISODate("2024-03-29T10:30:00.000Z")
}
```

---

## Testing the System

### Test Case 1: Successful Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "Your@SecurePassword123",
    "adminCode": "citizen_admin_2024"
  }'
```

Expected: `201 Created` with token

### Test Case 2: Invalid Admin Code

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "Your@SecurePassword123",
    "adminCode": "wrong_code"
  }'
```

Expected: `403 Forbidden` - "Invalid admin code"

### Test Case 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "Your@SecurePassword123"
  }'
```

Expected: `200 OK` with token

### Test Case 4: Access Protected Route

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token_from_login>"
```

Expected: `200 OK` with admin data

---

## Troubleshooting

### Issue: "Invalid admin code" during registration

**Solution**:
1. Verify the admin code matches `ADMIN_SECRET_CODE` in `.env`
2. Check for typos (case-sensitive)
3. Make sure MongoDB is running: `mongod`
4. Check backend is running: `npm start` in backend folder

### Issue: Cannot login after registration

**Solution**:
1. Verify MongoDB is running
2. Check that admin was created in database:
   ```bash
   # Using MongoDB shell
   db.admins.find()
   ```
3. Verify username and password are correct
4. Make sure backend is running on port 5000

### Issue: Token expires

**Solution**:
- Tokens last for 7 days
- Login again to get a new token
- Token is automatically stored in `localStorage`

### Issue: Admin dashboard not accessible

**Solution**:
1. Make sure you're logged in (check header for "Logout" button)
2. Verify token is stored in browser: Check DevTools → Application → LocalStorage
3. Try logging out and logging back in
4. Clear browser cache and try again

---

## Code Structure

### Backend Files

```
backend/
├── models/
│   └── Admin.js              # Admin schema with password hashing
├── controllers/
│   └── authController.js     # Register, login, getCurrentAdmin logic
├── routes/
│   └── authRoutes.js         # Auth endpoints
├── middleware/
│   └── auth.js               # JWT verification middleware
├── .env                       # Configuration (includes ADMIN_SECRET_CODE)
└── server.js                 # Express server setup
```

### Frontend Files

```
frontend/src/
├── pages/
│   ├── AdminLogin.jsx        # Login & Register form (unified)
│   ├── AdminDashboard.jsx    # Admin dashboard (protected)
│   └── Home.jsx              # Citizen complaint form
├── components/
│   ├── Header.jsx            # Navigation with login/logout
│   └── Footer.jsx            # Footer
└── services/
    └── axiosClient.js       # API client with JWT interceptor
```

---

## Next Steps

1. ✅ Backend configured with admin code validation
2. ✅ Frontend form updated with admin code field
3. ✅ JWT authentication middleware in place
4. 📝 Customize admin code in `.env` file
5. 📝 Test registration and login flow
6. 📝 Create additional admin accounts as needed
7. 📝 Configure email notifications for complaint resolution

---

## Support

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review error messages in browser console
3. Check backend logs in terminal
4. Verify MongoDB connection with `mongod`

---

**Last Updated**: March 29, 2026
**Version**: 1.0.0
