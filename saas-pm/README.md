# Flowdesk — Full-Stack SaaS Project Management Platform

A complete, real (not mocked) full-stack project management platform inspired by Jira/Asana/Linear —
built with the MERN stack (MongoDB, Express, React, Node.js).

Every button in the UI calls a real REST API, which reads and writes to a local MongoDB database.
There is no fake/hardcoded data in the running application — the only "demo data" is what the seed
script inserts into your local database, exactly like a real product's fixtures.

---

## 1. Features

- **Authentication** — register/login/logout, JWT auth, protected routes, change password, profile editing
- **Organizations/Workspaces** — every user gets a workspace; multi-workspace support with an org switcher
- **Roles & permissions** — Owner / Admin / Member / Viewer, enforced on the backend
- **Projects** — full CRUD, statuses, priorities, members, grid/list views, search/filter/sort
- **Tasks** — full CRUD, Jira-style IDs (`PROJ-1`), status, priority, labels, due dates, estimated/actual hours, story points
- **Kanban board** — real drag-and-drop (dnd-kit) that persists status changes to MongoDB
- **Subtasks** — add/edit/complete/delete, with a progress bar on the task card
- **Comments & activity history** — per-task comment thread; every major action writes an ActivityLog entry
- **File attachments** — upload/download/delete via Multer, stored on disk with metadata in MongoDB
- **Sprints** — create/start/complete sprints, backlog ↔ sprint task management
- **Burndown chart** — computed server-side from real story points and task completion dates (Recharts)
- **Dashboard** — live stats (totals, overdue, by-status/by-priority charts, my tasks, upcoming deadlines, recent activity)
- **Team management & invites** — invite by email, accept/reject/cancel; works without an email provider (dev-friendly link flow)
- **Light/dark mode**, fully responsive layout, loading/empty/error states everywhere
- **Landing page** for logged-out visitors

---

## 2. Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, dotenv, CORS, morgan
**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, dnd-kit, Recharts, lucide-react, react-hot-toast

---

## 3. Folder Structure

```text
saas-pm/
├── server/
│   ├── src/
│   │   ├── models/          User, Organization, Project, Task, SubTask, Sprint, ActivityLog, TeamInvite
│   │   ├── controllers/     business logic for every resource
│   │   ├── routes/          REST endpoints
│   │   ├── middleware/      auth (JWT), authorize (roles), upload (Multer), errorHandler
│   │   ├── utils/           token generation, activity logging, seed.js
│   │   └── server.js
│   ├── uploads/              attachment storage
│   └── .env.example
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── common/       Avatar, Badges, Modal, States (loading/empty/error), RouteGuards
    │   │   └── features/     projects/, board/, tasks/, sprints/
    │   ├── pages/             Home, Login, Register, Dashboard, Projects, Board, TaskDetail,
    │   │                      SprintPlanner, TeamSettings, Admin, AcceptInvite
    │   ├── layouts/            AppLayout, Sidebar, Topbar
    │   ├── context/            AuthContext, ThemeContext
    │   └── services/           axios client + typed API service functions
    └── .env.example
```

---

## 4. Prerequisites

- **Node.js** 18+ and npm
- **A local MongoDB server** running on `mongodb://127.0.0.1:27017`

### Installing MongoDB locally (if you don't have it)

- **macOS:** `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- **Windows:** install "MongoDB Community Server" from mongodb.com, it installs as a Windows service and starts automatically
- **Linux (Ubuntu/Debian):** follow MongoDB's official apt install guide, then `sudo systemctl start mongod`

Verify it's running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

If this doesn't work, the backend will fail to start with a clear error message telling you MongoDB isn't reachable — start `mongod` and try again.

---

## 5. Environment Variables

### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/saas_project_management
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 6. Installation & Running

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `GET http://localhost:5000/api/health`.

### Frontend (in a second terminal)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Seed demo data

With the backend's `.env` in place and MongoDB running:

```bash
cd server
npm run seed
```

This **clears** the relevant collections and inserts a demo organization, 5 users, 3 projects,
~24 tasks (with subtasks and comments), 4 sprints, activity logs, and one pending invite.

---

## 7. Demo Login Credentials

All seeded accounts use the password `password123`.

| Name          | Email              | Role   |
|---------------|--------------------|--------|
| Hammad Mukhtar| hammad@demo.com    | Owner  |
| Ali Raza      | ali@demo.com       | Admin  |
| Ahmed Khan    | ahmed@demo.com     | Member |
| Sara Malik    | sara@demo.com      | Member |
| Bilal Ahmed   | bilal@demo.com     | Viewer |

You can also just register a brand-new account from `/register` — it automatically creates
your own workspace as Owner, no seed data required.

---

## 8. API Overview

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password
PUT    /api/auth/switch-organization/:orgId

GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id
PUT    /api/organizations/:id
DELETE /api/organizations/:id
PATCH  /api/organizations/:id/members/:userId
DELETE /api/organizations/:id/members/:userId

GET    /api/projects?organization=
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/tasks?project=&sprint=&status=&priority=&assignee=&search=&sort=
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/status
PATCH  /api/tasks/:id/assign
POST   /api/tasks/:id/subtasks
PUT    /api/tasks/:id/subtasks/:subtaskId
DELETE /api/tasks/:id/subtasks/:subtaskId
POST   /api/tasks/:id/comments
POST   /api/tasks/:id/attachments      (multipart/form-data, field name "file")
DELETE /api/tasks/:id/attachments/:attachmentId

GET    /api/sprints?project=
POST   /api/sprints
PUT    /api/sprints/:id
DELETE /api/sprints/:id
GET    /api/sprints/:id/burndown
PATCH  /api/sprints/:id/tasks/:taskId
DELETE /api/sprints/:id/tasks/:taskId

GET    /api/activity?organization=&project=

GET    /api/invites?organization=
POST   /api/invites
PATCH  /api/invites/:token/accept
PATCH  /api/invites/:token/reject
DELETE /api/invites/:id

GET    /api/dashboard?organization=
```

---

## 9. Troubleshooting

**"Could not connect to MongoDB" on backend start**
MongoDB isn't running locally, or `MONGODB_URI` in `server/.env` is wrong. Start `mongod` and confirm
with `mongosh --eval "db.runCommand({ ping: 1 })"`.

**Frontend shows network errors / can't reach API**
Confirm the backend is running on port 5000 and `client/.env`'s `VITE_API_URL` matches it.
Also check the backend terminal for CORS errors — `CLIENT_URL` in `server/.env` must match the
frontend's actual origin (`http://localhost:5173` by default).

**Login works but the app immediately logs me out**
Your JWT likely expired or `JWT_SECRET` changed between sessions — log in again.

**File uploads fail**
Confirm `server/uploads/attachments` exists and is writable — it's created automatically on first
run, but check filesystem permissions if you deployed elsewhere. Max upload size is 10MB.

**Port already in use**
Change `PORT` in `server/.env` or the `server.port` in `client/vite.config.js`, and update
`VITE_API_URL` / `CLIENT_URL` accordingly.

---

## 10. Assumptions Made

- Each user's first registration auto-creates a personal workspace (Organization) with them as Owner —
  this matches how most real SaaS products onboard a first-time user.
- Task IDs (`PROJ-1`, `PROJ-2`, ...) are generated per-project via an incrementing counter stored on
  the Project document.
- Since no email provider was specified, team invitations use a **dev-friendly link flow**: creating
  an invite returns a shareable `inviteLink` in the API response and the invite also shows up in the
  Team Settings page, so admins can copy/paste it to invite (this can be swapped for a real transactional
  email provider like Resend/SendGrid later — the invite/accept logic is already fully separated from
  the code that would send the email).
- Burndown chart "actual" points are computed from each task's `updatedAt` timestamp when its status is
  `Done`, since detailed per-day time tracking wasn't specified.
- File attachments are validated for common types (images, PDFs, Office docs, zip, text) and capped at 10MB.
