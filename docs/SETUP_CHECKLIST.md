# ✅ EduForum Setup Checklist

**Print this out and check off each step as you complete it!**

## Pre-Setup Checklist
- [ ] I have cloned the EduForum repository to my computer
- [ ] I have a stable internet connection
- [ ] I'm ready to install some software

---

## Software Installation
- [ ] **Node.js installed** 
  - Download from: https://nodejs.org/
  - Choose LTS version
  - Test: Open terminal, type `node --version`
  
- [ ] **PostgreSQL installed**
  - Download from: https://www.postgresql.org/download/
  - Remember the password you set!
  - Test: Look for "pgAdmin" in installed programs

---

## Database Setup
- [ ] **pgAdmin opened successfully**
- [ ] **Connected to PostgreSQL server** (using your password)
- [ ] **Created database named:** `eduforum_db`
- [ ] **Database shows up in pgAdmin**

---

## Project Setup
- [ ] **Opened terminal/command prompt**
- [ ] **Navigated to EduForum folder:** `cd path/to/EduForum`
- [ ] **Installed backend dependencies:** 
  ```
  cd backend
  npm install
  ```
- [ ] **Installed frontend dependencies:**
  ```
  cd ../frontend  
  npm install
  cd ..
  ```

---

## Environment Configuration
- [ ] **Backend .env file created**
  - Copied `backend/.env.example` to `backend/.env`
  - Updated DATABASE_URL with my PostgreSQL password
  
- [ ] **Frontend .env file created**
  - Copied `frontend/.env.example` to `frontend/.env`
  - Left everything as default

---

## Database Migration
- [ ] **Database tables created:**
  ```
  cd backend
  npx prisma migrate deploy
  npx prisma generate
  ```

---

## Running the Application
- [ ] **Backend server started**
  - Terminal 1: `cd backend && npm run dev`
  - Sees: "Server running on http://localhost:3000"
  
- [ ] **Frontend server started**
  - Terminal 2: `cd frontend && npm run dev`
  - Sees: URL like "http://localhost:5173"

---

## Final Check
- [ ] **Opened browser to:** http://localhost:5173
- [ ] **EduForum website loads successfully**
- [ ] **Can navigate around the site**
- [ ] **🎉 SUCCESS! The application is running!**

---

## If Something Goes Wrong
**Most common fixes:**
1. Make sure PostgreSQL is running
2. Check the password in backend/.env file
3. Restart both terminal windows
4. Try installing Node.js again

**Need help?** Check these files:
- `QUICK_START.md` - Fast setup guide
- `SETUP_GUIDE.md` - Detailed instructions with troubleshooting

---

**✅ Once everything is checked off, you're ready to use EduForum!**
