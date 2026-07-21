# Enterprise Collaboration Platform

A production-ready, Slack/Microsoft Teams–style collaboration platform: teams, channels,
real-time chat, presence, notifications, file sharing, search, and an admin panel — built
on a modern MERN + Socket.IO stack.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router 6, Axios, React Hot Toast, Recharts, Lucide React, Socket.IO client
- **Backend:** Node.js, Express, MongoDB Atlas (Mongoose), Socket.IO, Redis (ioredis), JWT auth, bcryptjs, Multer, express-validator, Nodemailer, Winston + Morgan, Helmet, CORS, rate limiting
- **Docs:** Swagger / OpenAPI at `/api-docs`

## Project structure

```
backend/
  src/
    config/       # env, db, redis, logger, swagger
    models/       # User, Team, Channel, Message, Notification, ActivityLog, Invitation
    middleware/    # auth, rate limiting, upload, error handling, validation
    controllers/   # business logic per resource
    routes/        # Express routers + Swagger annotations
    sockets/       # Socket.IO auth, chat handlers, presence handlers
    utils/         # AppError, catchAsync, jwt, email, seed script
  uploads/         # uploaded files served at /uploads
frontend/
  src/
    api/           # axios instance + one module per resource
    context/       # Auth, Theme, Socket providers
    components/    # layout, chat, teams, channels, dashboard, admin, common
    pages/          # route-level pages (incl. admin/ subpages)
```

## Getting started

### 1. Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB)
- Redis (local `redis-server`, Docker, or a managed instance) — the app degrades gracefully
  (caching disabled) if Redis is unreachable, so it isn't a hard blocker for local dev.

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI (Atlas connection string), JWT_SECRET, REDIS_URL, SMTP_* (optional)
npm install
npm run seed   # optional: creates demo admin/owner/member users + a sample team
npm run dev    # starts on http://localhost:5000
```

Demo accounts created by `npm run seed` (all password `Password123`):

| Email             | Role        |
|-------------------|-------------|
| admin@ecp.com     | Admin       |
| sarah@ecp.com     | Team Owner  |
| james@ecp.com     | Member      |

> Note: the **first user ever registered** through `/auth/register` is automatically
> promoted to `admin` — so even without seeding, your first sign-up bootstraps the platform.

API docs: http://localhost:5000/api-docs
Health check: http://localhost:5000/health

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev    # starts on http://localhost:5173
```

The Vite dev server proxies `/api`, `/uploads`, and `/socket.io` to `http://localhost:5000`
(see `vite.config.js`), so no CORS configuration is needed locally.

### 4. Build for production

```bash
cd frontend && npm run build   # outputs to frontend/dist
cd backend && npm start        # NODE_ENV=production node src/server.js
```

Serve `frontend/dist` from any static host (Vercel, Netlify, Nginx, or Express static
middleware) and point it at your deployed backend URL.

## Environment variables (backend/.env)

See `backend/.env.example` for the full list. Required: `MONGODB_URI`, `JWT_SECRET`.
Everything else has a sane local-dev default or degrades gracefully (email logs instead
of sending if SMTP isn't configured; caching disabled if Redis isn't reachable).

## Feature map

- **Auth:** register, login, forgot/reset password, refresh tokens, JWT, role bootstrap
- **Teams:** create, update, delete (soft), invite by email, accept invite, remove/role-change members
- **Channels:** public/private, create/edit/delete/archive, join/leave, member management
- **Real-time chat:** Socket.IO messaging, typing indicators, read receipts, emoji reactions,
  file/image attachments with previews, @mentions
- **Presence:** online/away/offline with live broadcast to all shared teams, last-seen tracking
- **Notifications:** real-time via Socket.IO + persisted list, mentions, invites, channel/team events
- **Search:** full-text message search by keyword, filterable by channel/user/team
- **File sharing:** images, PDFs, docs via Multer, served from `/uploads`, download support
- **Activity logs:** login, team/channel/message lifecycle events, role changes — queryable in admin panel
- **Admin panel:** user management (role/activation), team directory, platform analytics
  (Recharts), activity log viewer
- **Dashboard:** stat cards, 7-day message trend, team distribution, recent activity feed
- **Redis caching:** dashboard overview, notifications list, team list — all with safe
  fallback to direct DB reads if Redis is down

## Security notes

- Passwords hashed with bcrypt (cost factor 12)
- JWT access + refresh token rotation, refresh tokens invalidated on password change
- Helmet, CORS allow-list, mongo-sanitize, xss-clean, rate limiting (global + auth-specific)
- File upload MIME allow-list + size limits
- Role-based route guards (`admin`, `team_owner`, `member`) + team-scoped membership checks
