# EduForum: Smart Academic Forum & Chatbot System

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview
EduForum is a comprehensive web-based platform designed to facilitate academic discussions, knowledge sharing, and interactive learning. The system integrates a smart AI chatbot to assist students and educators with queries, making communication seamless and efficient. It serves as a centralized hub for academic discussions, notices, and student-teacher interactions.

## ✨ Features

### User Management
- **Role-based Access Control**: Students, Teachers, and Admin roles
- **Secure Authentication**: JWT-based authentication with Google OAuth integration
- **Profile Management**: Customizable user profiles with department association

### Academic Features
- **Forum Discussions**: Create, read, update, and delete academic posts
- **Comments System**: Interactive commenting on posts
- **Department-based Filtering**: Posts and notices organized by departments
- **File Attachments**: Support for file uploads in notices 

### Notice Management
- **Centralized Noticeboard**: Department-specific notices
- **Important Notices**: Priority flagging for critical announcements
- **File Attachments**: Support for PDF, DOC, and image files
- **Publishing Control**: Draft and publish functionality

### AI Chatbot Integration
- **Smart Assistance**: AI-powered responses to academic queries
- **Conversation History**: Persistent chat history
- **Context-aware Responses**: Department-specific knowledge base

### Admin Dashboard
- **User Management**: Create, update, and manage user accounts
- **Department Management**: Add and manage academic departments
- **Analytics**: Overview of platform usage and engagement
- **Content Moderation**: Manage posts and notices

## 🛠 Tech Stack

### Frontend
- **React.js**: UI framework with Vite for optimization
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **JWT Authentication**: Secure user sessions
- **Material UI**: Component library
- **React Icons**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **Prisma**: ORM for database operations
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **Passport.js**: Authentication middleware
- **Google OAuth**: Social authentication

## 🚀 Installation Guide

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/itspiyush3451/EduForum.git
   cd EduForum
   ```

2. **Install dependencies**
   ```sh
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration

4. **Database setup**
   ```sh
   cd backend
   npx prisma migrate dev
   ```

5. **Run the development servers**
   ```sh
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 🔧 Environment Setup

### Frontend (.env)
```env
JWT_SECRET=your_jwt_secret_here
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_AUTH_TOKEN_NAME=eduforum_token
VITE_TOKEN_EXPIRY_REDIRECT=true
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
SESSION_SECRET=your_session_secret_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your_session_secret_here
```

## 📁 Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   └── assets/         # Static assets
```

### Backend
```
backend/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middlewares/        # Express middlewares
├── prisma/            # Database schema
├── routes/            # API routes
├── services/          # Business logic
└── uploads/           # File uploads
```

## 📚 API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when running the backend server. It includes detailed information about:
- Authentication endpoints
- User management
- Post and comment operations
- Notice management
- Department operations
- Chatbot integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
