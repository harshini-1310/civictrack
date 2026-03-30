# ⚡ Citizen Connect - Quick Reference Card

## 🚀 Start Here (3 Commands)

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Then visit: http://localhost:5173
```

## 🌐 URLs

| Component | URL |
|-----------|-----|
| Frontend (Citizen) | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

## 📄 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server entry point |
| `frontend/src/App.jsx` | React app with routing |
| `backend/.env` | Backend configuration |
| `frontend/.env` | Frontend configuration |
| `README.md` | Full documentation |
| `SETUP.md` | Quick start guide |

## 🗂️ Project Layout

```
citizen-connect/
├── backend/        ← Node.js + Express + MongoDB
├── frontend/       ← React + Vite + Tailwind CSS
├── README.md       ← Full docs
├── SETUP.md        ← Quick start
└── start-servers.*  ← Startup script
```

## 🔑 Test Credentials

**First Time:**
1. Go to `/admin-login`
2. Click "Register"
3. Create your own username/password combo
4. Minimum password length: 6 characters

**Example:**
- Username: `your_username`
- Password: `your_secure_password`

## 📝 Main Pages

| Page | URL | Type |
|------|-----|------|
| Home / Form | `/` | Public |
| Admin Login | `/admin-login` | Public |
| Dashboard | `/admin-dashboard` | Protected |

## 🔌 API Quick Reference

```javascript
// Public - Create Complaint
POST /api/complaints
{
  title: "...",
  description: "...",
  category: "Road|Electricity|Drainage|Other",
  severity: "Low|Medium|High|Emergency",
  location: "...",
  email: "..." // optional
}

// Admin - Get All Complaints
GET /api/complaints
Header: Authorization: Bearer <token>

// Admin - Resolve Complaint
PUT /api/complaints/:id
Header: Authorization: Bearer <token>
{
  status: "Resolved",
  resolutionNotes: "..."
}

// Admin - Login
POST /api/auth/login
{
  username: "...",
  password: "..."
}
```

## 🛠️ Dependencies

**Backend:**
- express, mongoose, cors, dotenv
- jsonwebtoken, bcryptjs, nodemailer, axios

**Frontend:**
- react, react-dom, react-router-dom
- axios, tailwindcss, vite

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/citizen-connect
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Categories & Severity

**Categories:**
- 🛣️ Road
- ⚡ Electricity  
- 💧 Drainage
- 🔧 Other

**Severity:**
- 🟢 Low
- 🟡 Medium
- 🔴 High
- 🚨 Emergency

**Status:**
- 📋 Pending
- ✅ Resolved

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB error | Start MongoDB: `mongod` |
| Port 5000 occupied | Change PORT in .env |
| CORS error | Ensure both servers running |
| Login fails | Register new admin first |
| Emails not sending | Set EMAIL_USER and EMAIL_PASSWORD |

## 📊 Database

**Collections:**
- `complaints` - All submitted complaints
- `admins` - Admin accounts

**Access:**
```bash
mongosh
use citizen-connect
db.complaints.find()
db.admins.find()
```

## 🔒 Security

- ✅ Passwords hashed (bcryptjs)
- ✅ JWT tokens (7-day expiry)
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS configured

## 📱 Features Summary

**Citizen Features:**
- ✅ Submit complaints
- ✅ Get email notifications on resolution
- ✅ Multiple categories & severity levels

**Admin Features:**
- ✅ Secure login/registration
- ✅ View all complaints
- ✅ Filter by status/severity
- ✅ Search complaints
- ✅ Resolve complaints
- ✅ See statistics dashboard

## 🚀 Deployment

**Backend:**
- Ready for Heroku, Railway, Render
- Set NODE_ENV=production
- Use MongoDB Atlas for database

**Frontend:**
- Ready for Vercel, Netlify
- Set VITE_API_URL to production backend
- Run: `npm run build`

## 📚 Documentation Files

| File | Content |
|------|---------|
| README.md | Complete project documentation |
| SETUP.md | Step-by-step setup guide |
| IMPLEMENTATION_SUMMARY.md | What was built & how |
| PROJECT_STRUCTURE.md | File structure & features |
| This File | Quick reference |

## 💡 Tips

1. **First launch:** Register admin before accessing dashboard
2. **Email setup:** Optional but recommended for production
3. **Testing:** Submit complaint → Login → Resolve → Check email
4. **Debugging:** Check browser console & terminal output
5. **Database:** MongoDB must be running before backend starts

## 🎯 Common Tasks

**Submit a complaint:**
1. Go to http://localhost:5173
2. Fill form → Submit

**Login as admin:**
1. Go to /admin-login
2. Register or Login
3. Redirect to dashboard

**Resolve a complaint:**
1. In dashboard, expand card
2. Click "Mark as Resolved"
3. Add notes → Confirm
4. Email sent automatically

**Filter complaints:**
1. Use Status filter (Pending/Resolved)
2. Use Severity filter (Low/Medium/High/Emergency)
3. Use Search box (title/location)

## 🔄 API Response Format

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 📧 Email Template

When resolving a complaint:
- Subject: "Your Complaint Has Been Resolved"
- Includes: Title, Category, Severity, Location, Resolution Notes
- Sent to: Citizen's email (if provided)

## 🎓 Tech Stack Summary

```
Frontend:           Backend:
React 19       +    Express 5
Vite               MongoDB 9
Tailwind CSS       Mongoose
React Router       JWT Auth
Axios              Bcryptjs
                   Nodemailer
```

## ⏱️ Typical Timeline

| Task | Time |
|------|------|
| Install dependencies | 2-3 min |
| Configure .env | 2 min |
| Start servers | 30 sec |
| Test citizen flow | 2 min |
| Test admin flow | 3 min |
| **Total** | ~12 min |

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Dependencies installed (both folders)
- [ ] .env configured
- [ ] Backend running on :5000
- [ ] Frontend running on :5173
- [ ] Can submit complaint
- [ ] Can register admin
- [ ] Can see dashboard
- [ ] Can resolve complaint

## 🎉 Ready to Launch!

You have a complete, production-ready full-stack application.

**Next:** See [SETUP.md](./SETUP.md) for detailed instructions!

---

**Questions?** Check README.md or SETUP.md

**Happy coding! 🚀**
