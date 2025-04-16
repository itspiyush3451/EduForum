# EduForum API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except those marked as public require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Google OAuth
- **GET** `/auth/google`
  - Initiates Google OAuth login
  - Public endpoint
  - Redirects to Google login page

- **GET** `/auth/google/callback`
  - Handles Google OAuth callback
  - Public endpoint
  - Redirects to dashboard on success

#### User Authentication
- **POST** `/users/signup`
  - Register a new user
  - Public endpoint
  - Body: `{ username, email, password, departmentId }`

- **POST** `/users/login`
  - Authenticate user
  - Public endpoint
  - Body: `{ email, password }`

- **POST** `/users/logout`
  - Logout user
  - Protected endpoint
  - Clears session and token

### User Management

#### Profile Management
- **PUT** `/users/changepassword`
  - Change user password
  - Protected endpoint
  - Body: `{ currentPassword, newPassword }`

- **PUT** `/users/changeemail`
  - Change user email
  - Protected endpoint
  - Body: `{ newEmail, password }`

- **GET** `/users/profile`
  - Get user profile
  - Protected endpoint

- **PUT** `/users/profile`
  - Update user profile
  - Protected endpoint
  - Body: `{ username, departmentId }`

#### Admin User Management
- **GET** `/users`
  - Get all users (Admin only)
  - Protected endpoint
  - Requires ADMIN role

- **PUT** `/users/:userId`
  - Update user (Admin only)
  - Protected endpoint
  - Requires ADMIN role
  - Body: `{ username, email, departmentId, role }`

- **DELETE** `/users/:userId`
  - Delete user (Admin only)
  - Protected endpoint
  - Requires ADMIN role

### Department Management

- **GET** `/departments`
  - Get all departments
  - Public endpoint

- **GET** `/departments/:departmentId`
  - Get department by ID
  - Protected endpoint

- **POST** `/departments`
  - Create new department (Admin only)
  - Protected endpoint
  - Requires ADMIN role
  - Body: `{ name, description }`

- **PUT** `/departments/:departmentId`
  - Update department (Admin only)
  - Protected endpoint
  - Requires ADMIN role
  - Body: `{ name, description }`

- **DELETE** `/departments/:departmentId`
  - Delete department (Admin only)
  - Protected endpoint
  - Requires ADMIN role

### Notice Management

- **GET** `/notices`
  - Get all notices
  - Protected endpoint

- **GET** `/notices/usernotices`
  - Get notices created by the logged-in user
  - Protected endpoint

- **POST** `/notices/create`
  - Create a new notice (Teacher/Admin only)
  - Protected endpoint
  - Requires TEACHER or ADMIN role
  - Body: `{ title, content, important, published, file }`

- **PUT** `/notices/:noticeid`
  - Update notice (Teacher/Admin only)
  - Protected endpoint
  - Requires TEACHER or ADMIN role
  - Body: `{ title, content, important, published, file }`

- **DELETE** `/notices/:noticeid`
  - Delete notice (Teacher/Admin only)
  - Protected endpoint
  - Requires TEACHER or ADMIN role

- **GET** `/notices/:noticeId/download/:filename`
  - Download notice attachment
  - Protected endpoint

### Post Management

- **GET** `/posts/all`
  - Get all posts
  - Protected endpoint

- **GET** `/posts/userposts`
  - Get posts created by the logged-in user
  - Protected endpoint

- **POST** `/posts/createpost`
  - Create a new post
  - Protected endpoint
  - Body: `{ title, content, departmentId }`

- **PUT** `/posts/:postid`
  - Update post
  - Protected endpoint
  - Body: `{ title, content, departmentId }`

- **DELETE** `/posts/:postid`
  - Delete post
  - Protected endpoint

### Comment Management

- **GET** `/comments/post/:postid`
  - Get comments for a post
  - Protected endpoint

- **POST** `/comments`
  - Create a new comment
  - Protected endpoint
  - Body: `{ content, postId }`

- **PUT** `/comments/:commentid`
  - Update comment
  - Protected endpoint
  - Body: `{ content }`

- **DELETE** `/comments/:commentid`
  - Delete comment
  - Protected endpoint

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request**
  ```json
  {
    "success": false,
    "message": "Invalid request data"
  }
  ```

- **401 Unauthorized**
  ```json
  {
    "success": false,
    "message": "Unauthorized access"
  }
  ```

- **403 Forbidden**
  ```json
  {
    "success": false,
    "message": "Insufficient permissions"
  }
  ```

- **404 Not Found**
  ```json
  {
    "success": false,
    "message": "Resource not found"
  }
  ```

- **500 Internal Server Error**
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```

## File Uploads

File uploads are supported for notices. The following file types are allowed:
- PDF (.pdf)
- Word documents (.doc, .docx)
- Text files (.txt)
- Images (.jpg, .jpeg, .png)

Maximum file size: 5MB 