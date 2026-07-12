# Ascend LMS — Full-Stack Enterprise Learning Management System

A complete, production-ready LMS with a Node.js/Express/MongoDB backend and a React + Tailwind CSS frontend.

Roles: **Admin**, **Instructor**, **Student** — each with a dedicated dashboard.

---

## 1. Tech Stack

**Backend:** Node.js, Express.js, MongoDB (local), Mongoose, JWT auth, bcryptjs, express-validator, Multer, Nodemailer, Morgan, Winston, Helmet, CORS, express-rate-limit, dotenv, Swagger (OpenAPI), Jest + Supertest.

**Frontend:** React 19 (Vite), React Router, Tailwind CSS, Axios, react-hot-toast, Recharts, lucide-react.

---

## 2. Folder Structure

```
lms-project/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, swagger.js
│   │   ├── controllers/     # auth, user, course, assignment, quiz, notification, certificate
│   │   ├── middleware/      # auth, errorHandler, upload, rateLimiter, validate
│   │   ├── models/          # User, Course, Assignment, Submission, Quiz, QuizResult, Notification, Certificate
│   │   ├── routes/          # one router per module + index.js
│   │   ├── services/        # emailService.js (Nodemailer)
│   │   ├── validators/      # express-validator chains
│   │   ├── utils/           # ApiError, ApiResponse, catchAsync, apiFeatures, logger, generateToken
│   │   ├── uploads/         # profiles/ assignments/ thumbnails/ (served at /uploads)
│   │   ├── tests/           # Jest + Supertest tests
│   │   └── app.js
│   ├── logs/                 # winston log files
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/       # Sidebar, Topbar, DashboardLayout, Modal, StatCard, etc.
    │   ├── context/           # AuthContext.jsx
    │   ├── services/          # api.js (Axios instance + token refresh)
    │   ├── pages/
    │   │   ├── auth/          # Login, Register, ForgotPassword, ResetPassword
    │   │   ├── dashboard/     # AdminDashboard, InstructorDashboard, StudentDashboard
    │   │   ├── courses/       # CourseList, CourseDetail, CourseForm
    │   │   ├── assignments/   # AssignmentList, AssignmentForm
    │   │   ├── quizzes/       # QuizList, QuizForm, QuizAttempt
    │   │   ├── notifications/ # NotificationList
    │   │   ├── certificates/  # CertificateList
    │   │   ├── users/         # UserList (admin)
    │   │   └── profile/       # Profile
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env
```

---

## 3. Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` (Community Edition). Install from https://www.mongodb.com/try/download/community and make sure the `mongod` service/daemon is running before starting the backend.

---

## 4. Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (JWT secrets, SMTP credentials, etc.) — sensible defaults are already filled in for local dev.
```

### Frontend

```bash
cd frontend
npm install
# .env is already created with VITE_API_URL=http://localhost:5000/api/v1
```

---

## 5. Running the Project

**1. Start MongoDB** (in its own terminal, if not already running as a service):
```bash
mongod
```

**2. Start the backend** (in `backend/`):
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

**3. Seed sample data** (optional but recommended — creates demo users, courses, assignments, quizzes):
```bash
npm run seed
```
Demo accounts (password for all: `Password123!`):
| Role       | Email                |
|------------|-----------------------|
| Admin      | admin@lms.com         |
| Instructor | instructor@lms.com    |
| Instructor | maria@lms.com         |
| Student    | student@lms.com       |
| Student    | priya@lms.com         |
| Student    | ken@lms.com            |

**4. Start the frontend** (in `frontend/`, separate terminal):
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`.

**5. Open the app:** http://localhost:5173 — log in with any demo account above, or register a new account.

---

## 6. Swagger API Documentation

Once the backend is running, view interactive API docs at:

```
http://localhost:5000/api/docs
```

Health check endpoint: `http://localhost:5000/api/health`

---

## 7. Running Backend Tests

```bash
cd backend
npm test
```

Tests use `mongodb-memory-server`, which downloads a small MongoDB binary the **first time you run tests** — this requires an internet connection for that one-time download (afterwards it's cached locally). Tests cover Authentication and Course APIs (registration, login, RBAC, enrollment, etc.).

---

## 8. All npm Packages Used

**Backend:** express, mongoose, bcryptjs, jsonwebtoken, express-validator, multer, nodemailer, morgan, winston, helmet, cors, express-rate-limit, express-mongo-sanitize, xss-clean, dotenv, cookie-parser, swagger-jsdoc, swagger-ui-express — dev: nodemon, jest, supertest, mongodb-memory-server, cross-env

**Frontend:** react, react-dom, react-router-dom, axios, react-hot-toast, recharts, lucide-react, date-fns — dev: vite, tailwindcss, postcss, autoprefixer

---

## 9. Sample API Requests (for Postman / curl)

**Register**
```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "student"
}
```

**Login**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{ "email": "admin@lms.com", "password": "Password123!" }
```
Response includes `data.accessToken` — use it as `Authorization: Bearer <token>` on protected routes.

**Get all courses (public, supports filters)**
```
GET http://localhost:5000/api/v1/courses?search=web&category=Web%20Development&page=1&limit=10
```

**Create a course (Instructor/Admin, multipart for thumbnail)**
```
POST http://localhost:5000/api/v1/courses
Authorization: Bearer <token>
Content-Type: multipart/form-data

title=New Course
description=Course description
category=Web Development
price=99
```

**Enroll in a course (Student)**
```
POST http://localhost:5000/api/v1/courses/:id/enroll
Authorization: Bearer <token>
```

**Submit an assignment (Student, multipart)**
```
POST http://localhost:5000/api/v1/assignments/:id/submit
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<binary file>
```

**Attempt a quiz (Student)**
```
POST http://localhost:5000/api/v1/quizzes/:id/attempt
Authorization: Bearer <token>
Content-Type: application/json

{ "answers": [{ "question": "<questionId>", "selectedAnswer": "let" }] }
```

Full endpoint list with request/response schemas: see Swagger docs at `/api/docs`.

---

## 10. Additional Notes

- **Email:** If `EMAIL_USER`/`EMAIL_PASS` are not set in `backend/.env`, emails are skipped and logged instead of sent (no crash) — convenient for local development. To actually send email, use an SMTP provider (e.g. a Gmail App Password) and fill in the `EMAIL_*` variables.
- **File uploads** are stored locally under `backend/src/uploads/` and served statically at `http://localhost:5000/uploads/...`.
- **Rate limiting** is applied globally (`/api/*`) and more strictly on auth endpoints (register/login/forgot-password).
- **RBAC** is enforced both in Express middleware (`authorize('admin', ...)`) and in the frontend (routes/sidebar links are role-aware; the `UserList` admin page is protected via `ProtectedRoute roles={['admin']}`).
- To reset the database at any time, just re-run `npm run seed` in `backend/` (it clears and reseeds all collections).
- Production build for the frontend: `cd frontend && npm run build` → outputs to `frontend/dist/` (serve with any static host, or point Nginx/Express at it).
