# 🚀 EduForum Project Setup Guide

**A comprehensive guide to set up and run the EduForum project on your local machine**

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Required Software Installation](#required-software-installation)
3. [Database Setup](#database-setup)
4. [Project Setup](#project-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Additional Resources](#additional-resources)

---

## 📚 Prerequisites

Before starting, make sure you understand:
- This is a full-stack web application with a React frontend and Node.js backend
- You'll need to install several software tools
- The project uses PostgreSQL as the database
- Basic terminal/command prompt usage will be required

---

## 🛠️ Required Software Installation

### 1. **Node.js and npm**
Node.js is required to run the backend server and frontend development server.

**Installation:**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the installation wizard
4. Accept all default settings

**Verify Installation:**
Open Command Prompt (Windows) or Terminal (Mac/Linux) and run:
```bash
node --version
npm --version
```
You should see version numbers like `v20.x.x` and `10.x.x`

### 2. **PostgreSQL Database**
PostgreSQL is the database system used by this project.

**Installation:**
1. Go to [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Choose your operating system
3. Download and run the installer
4. **Important:** Remember the password you set for the `postgres` user during installation
5. Keep the default port `5432`
6. Install all components (PostgreSQL Server, pgAdmin, etc.)

**Verify Installation:**
- Look for "pgAdmin" in your installed programs
- You should be able to open it and connect to your local server

### 3. **Git (if not already installed)**
Git is used for version control and you've already cloned the repository.

**Verify Installation:**
```bash
git --version
```

### 4. **Code Editor (Recommended)**
- **VS Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Or any text editor of your choice

---

## 🗄️ Database Setup

### Step 1: Create Database
1. Open **pgAdmin** (PostgreSQL administration tool)
2. Connect to your PostgreSQL server using the password you set during installation
3. Right-click on "Databases" → "Create" → "Database..."
4. Name your database: `eduforum_db`
5. Click "Save"

### Step 2: Note Database Details
Keep these details handy for environment configuration:
- **Database Name**: `eduforum_db`
- **Username**: `postgres` (default)
- **Password**: [The password you set during PostgreSQL installation]
- **Host**: `localhost`
- **Port**: `5432` (default)

---

## 📁 Project Setup

### Step 1: Navigate to Project Directory
Open Command Prompt/Terminal and navigate to your cloned project:
```bash
cd path/to/EduForum
```
*Replace `path/to/EduForum` with the actual path where you cloned the repository*

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```
Wait for all packages to download and install (this may take a few minutes).

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
Wait for all packages to download and install.

### Step 4: Go Back to Root Directory
```bash
cd ..
```

---

## ⚙️ Environment Configuration

### Step 1: Backend Environment Setup
1. Navigate to the `backend` folder
2. Copy `.env.example` and rename it to `.env`
3. Open `.env` file in a text editor and update the following:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/eduforum_db"

# JWT Configuration  
JWT_SECRET=eduforum_super_secret_jwt_key_2024

# Google OAuth Configuration (Optional - for Google login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session Configuration
SESSION_SECRET=eduforum_session_secret_key_2024
```

**Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### Step 2: Frontend Environment Setup
1. Navigate to the `frontend` folder  
2. Copy `.env.example` and rename it to `.env`
3. Open `.env` file in a text editor and update:

```bash
# JWT Configuration
JWT_SECRET=eduforum_super_secret_jwt_key_2024

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_NAME=eduforum_token
VITE_TOKEN_EXPIRY_REDIRECT=true

# OAuth Configuration (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
SESSION_SECRET=eduforum_session_secret_key_2024
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### Step 3: Database Migration
Set up the database tables:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

---

## 🚀 Running the Application

### Method 1: Run Backend and Frontend Separately (Recommended)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
You should see: `Server running on http://localhost:3000`

**Terminal 2 - Frontend Server:**
Open a new Command Prompt/Terminal window:
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173/`

### Method 2: Alternative Backend Start
If `npm run dev` doesn't work for backend:
```bash
cd backend
node App.js
```

### 🎉 Access the Application
1. **Frontend (User Interface)**: Open your browser and go to `http://localhost:5173`
2. **Backend API**: Available at `http://localhost:3000`

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "npm: command not found" or "node: command not found"
**Solution:** Node.js is not installed properly or not in PATH
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- Restart your computer after installation
- Make sure to install the LTS version

#### Issue 2: Database connection error
**Error:** `ECONNREFUSED` or `database does not exist`
**Solution:**
- Make sure PostgreSQL is running
- Check if the database `eduforum_db` exists in pgAdmin
- Verify your DATABASE_URL in the backend `.env` file
- Ensure your PostgreSQL password is correct

#### Issue 3: Port already in use
**Error:** `Port 3000 is already in use` or `Port 5173 is already in use`
**Solution:**
- Kill the process using the port, or
- The development server will automatically try the next available port
- Check the terminal output for the actual port being used

#### Issue 4: Prisma migration errors
**Solution:**
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
npx prisma generate
```

#### Issue 5: Module not found errors
**Solution:**
Make sure you've installed dependencies:
```bash
# In backend folder
npm install

# In frontend folder  
npm install
```

#### Issue 6: CORS errors in browser console
**Solution:** Make sure both backend and frontend are running, and the API URLs in frontend `.env` are correct.

---

## 🔧 Additional Resources

### Useful Commands

**Check if ports are available:**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :3000
lsof -i :5173
```

**Stop running servers:**
- Press `Ctrl + C` in the terminal where the server is running

**Reset everything and start fresh:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules
npm install

cd ../frontend
rm -rf node_modules
npm install
```

### Default Login Credentials
After setting up, you may need to create admin user. Check the backend code or database for default credentials, or register a new account through the application.

### Project Structure
```
EduForum/
├── backend/          # Node.js API server
├── frontend/         # React application  
├── Chatbot/          # AI chatbot component
└── UI_IMG/           # UI screenshots
```

---

## 📞 Need Help?

If you encounter issues:
1. Check the error messages carefully
2. Verify all software is installed correctly
3. Ensure all environment variables are set properly
4. Make sure PostgreSQL is running
5. Try restarting both backend and frontend servers

**Key Points to Remember:**
- Always run backend before frontend
- Keep both terminal windows open while using the application
- The database must be created and running
- Environment files (.env) are crucial for proper operation

---

## ✅ Success Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL installed and running
- [ ] Database `eduforum_db` created
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Backend `.env` file configured with correct database URL
- [ ] Frontend `.env` file configured  
- [ ] Database migrated (`npx prisma migrate deploy`)
- [ ] Backend server running on http://localhost:3000
- [ ] Frontend server running on http://localhost:5173
- [ ] Application accessible in browser

**🎊 Congratulations! Your EduForum application should now be running successfully!**
