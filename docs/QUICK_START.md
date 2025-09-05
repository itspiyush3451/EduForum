# 🚀 Quick Start Guide for EduForum

**For someone who just wants to get it running fast!**

## 1. Install Required Software

### Download and Install (in this order):
1. **Node.js**: https://nodejs.org/ (download LTS version)
2. **PostgreSQL**: https://www.postgresql.org/download/ (remember the password you set!)

## 2. Setup Database
1. Open **pgAdmin** (comes with PostgreSQL)
2. Create a new database named: `eduforum_db`

## 3. Setup Project

Open Command Prompt/Terminal and run these commands one by one:

```bash
# Navigate to your project folder
cd path/to/EduForum

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
cd ..
```

## 4. Configure Environment

### Backend Configuration:
1. Go to `backend` folder
2. Copy `.env.example` file and rename it to `.env`
3. Open `.env` and change this line:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/eduforum_db"
   ```
   Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Frontend Configuration:
1. Go to `frontend` folder  
2. Copy `.env.example` file and rename it to `.env`
3. Keep all settings as they are (no changes needed)

## 5. Setup Database Tables

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

## 6. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
Wait until you see: "Server running on http://localhost:3000"

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Wait until you see a URL like: "http://localhost:5173"

## 7. Open in Browser
Go to: **http://localhost:5173**

## ❌ If Something Goes Wrong

**Can't install Node.js packages?**
- Make sure Node.js is installed: run `node --version`
- Try running as administrator

**Database connection error?**
- Make sure PostgreSQL is running
- Check your password in the `.env` file
- Make sure database `eduforum_db` exists

**Port already in use?**
- The app will automatically use the next available port
- Check the terminal output for the actual URL

## ✅ Success!
If you see the EduForum website in your browser, you're done! 🎉

---
**Need detailed help?** Check the main `SETUP_GUIDE.md` file for comprehensive instructions.
