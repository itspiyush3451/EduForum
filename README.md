# EduForum: Smart Academic Forum & Chatbot System

## Project Overview

EduForum is a web-based platform designed to facilitate academic discussions, knowledge sharing, and interactive learning. The system integrates a **smart AI chatbot** to assist students and educators with queries, making communication seamless and efficient.

![Dashboard Overview](DASHBOARD.jpg)

## Features

- **User Authentication**: Secure login and signup system
- **Forum Discussions**: Post, comment, and interact with academic topics
- **Notices & Announcements**: Centralized noticeboard for students
- **AI Chatbot**: Instant AI-powered assistance
- **Settings Management**: Customizable user preferences
- **User Dashboard**: Personalized feed of notices, discussions, and more

## UI Screenshots

### Authentication & Registration
| Login Page | Student Registration | Teacher Registration |
|:---:|:---:|:---:|
| ![Login Page](UI_IMG/LoginPage.jpg) | ![Student Registration](UI_IMG/StudentRegisteration.jpg) | ![Teacher Registration](UI_IMG/TeacherRegisteration.jpg) |

| Admin Protection Wrapper | Admin Registration |
|:---:|:---:|
| ![Admin Protection](UI_IMG/AdminProtecttionWrapper(Before%20Admin%20Registeration).jpg) | ![Admin Registration](UI_IMG/AdminRegisterationPage.jpg) |

### User Dashboards
| Admin Dashboard | Student Dashboard | Teacher Dashboard |
|:---:|:---:|:---:|
| ![Admin Dashboard](UI_IMG/AdminDashboard.jpg) | ![Student Dashboard](UI_IMG/StudentsDashboardd.jpg) | ![Teacher Dashboard](UI_IMG/TeachersDashboard.jpg) |

### Communication & Content Management
| All Posts | My Posts | Notices |
|:---:|:---:|:---:|
| ![All Posts](UI_IMG/AllPosts.jpg) | ![My Posts](UI_IMG/MyPosts.jpg) | ![Notices](UI_IMG/Notices.jpg) |

| Notices For Teachers | Create Notice |
|:---:|:---:|
| ![Notices For Teachers](UI_IMG/NoticesForTeacher.jpg) | ![Create Notice](UI_IMG/CreateNotice.jpg) |

### Administration & Settings
| User Management | Department Management | Settings |
|:---:|:---:|:---:|
| ![User Management](UI_IMG/UserManagement.jpg) | ![Department Management](UI_IMG/DepartmentManagement.jpg) | ![Settings](UI_IMG/Settings.jpg) |

### Support
![FAQ Page](UI_IMG/FAQ.jpg)

## Tech Stack

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

### Chatbot Integration

- **Natural Language Processing**: For understanding user queries
- **Department-specific Knowledge Base**: Tailored responses for different academic departments
- **Real-time Processing**: Instant response generation
- **Context Management**: Maintaining conversation context
- **Learning System**: Improving responses based on user interactions

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
VITE_CHATBOT_API_URL=http://localhost:3000/api/chatbot
```

### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your_session_secret_here
CHATBOT_MODEL_PATH=path_to_your_chatbot_model
CHATBOT_TRAINING_DATA=path_to_training_data
```

## 📁 Project Structure

### Frontend

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── chatbot/   # Chatbot-specific components
│   │   └── ...
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
│   ├── chatbot/       # Chatbot controller
│   └── ...
├── middlewares/        # Express middlewares
├── prisma/            # Database schema
├── routes/            # API routes
├── services/          # Business logic
│   ├── chatbot/       # Chatbot service
│   └── ...
└── uploads/           # File uploads
```

## 🤖 Chatbot Features

### Core Capabilities

- **Academic Query Resolution**: Answer questions about courses, departments, and campus facilities
- **Department-specific Assistance**: Provide tailored responses based on user's department
- **Real-time Interaction**: Instant responses to user queries
- **Context Awareness**: Maintain conversation context for better assistance
- **Learning System**: Improve responses based on user interactions

### Integration Points

- **Notice Board**: Provide information about recent notices
- **Forum Posts**: Assist with forum-related queries
- **User Profile**: Help with profile management
- **Department Information**: Provide department-specific details

### Technical Implementation

- **Natural Language Processing**: For understanding user intent
- **Response Generation**: Creating contextually relevant answers
- **Knowledge Base**: Department-specific information storage
- **Learning System**: Continuous improvement through user interactions

## 📚 API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when running the backend server. It includes detailed information about:

- Authentication endpoints
- User management
- Post and comment operations
- Notice management
- Department operations
- Chatbot integration
  - Query processing
  - Response generation
  - Context management
  - Learning system

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.

## 🔗 Resources

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Natural Language Processing](https://www.nltk.org/)
