# Clinic Website — Full MERN Stack

A physiotherapy & chiropractic clinic website: a React (Vite) frontend and an
Express + MongoDB (Mongoose) backend, each fully independent and connected
only via a REST API.

```
website/
├── frontend/     React + Vite SPA (see frontend/README.md)
├── backend/      Express + MongoDB API (see backend/README.md)
├── package.json  Convenience scripts to run both together
└── README.md     This file
```

## Quick start

```bash
# From the website/ root
npm run install:all

# Configure both apps
cp backend/.env.example backend/.env      # fill in MONGODB_URI, JWT_SECRET, etc.
cp frontend/.env.example frontend/.env    # defaults to http://localhost:5000/api — fine as-is

# Seed the database (requires MONGODB_URI to be set)
npm run seed

# Run both frontend and backend together
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin login: http://localhost:5173/admin/login

Each app also runs completely independently — `cd backend && npm run dev` or
`cd frontend && npm run dev` work exactly as if the other didn't exist. The
root `package.json` just wraps both with [concurrently](https://www.npmjs.com/package/concurrently)
for convenience; delete it and nothing else breaks.

## About your database connection string

You haven't shared a MongoDB connection string in this conversation, and even
if you had, I wouldn't put a real one inside a project file that gets zipped
and handed back to you — anyone who receives the zip would have your
database credentials. Put it directly into `backend/.env` yourself (that
file is git-ignored and never leaves your machine):

```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxx.mongodb.net/clinic_management
```

Once that's set, run `npm run seed` from the root (or `cd backend && npm run
seed`) to populate the database with realistic demo content, then everything
—the public site and the admin dashboard — runs on live data.

## How the pieces fit together

1. **Backend** (`backend/`) exposes a REST API at `/api/*` — services,
   practitioners, testimonials, appointments, contact messages, clinic
   settings, and cookie-based admin auth. See `backend/README.md` for the
   full route table.
2. **Frontend** (`frontend/`) is a pure SPA that talks to that API via
   Axios (`frontend/src/services/*.js`). It never touches MongoDB directly.
   `VITE_API_URL` in `frontend/.env` points it at the backend.
3. If the backend isn't reachable, the frontend falls back to realistic demo
   content (`frontend/src/utils/demoData.js`) so it's always demonstrable on
   its own — this was built before the backend existed and that fallback is
   still there as a safety net.
4. CORS on the backend is locked to `FRONTEND_URL` (from `backend/.env`) with
   credentials enabled, so the admin session cookie flows correctly between
   the two dev servers running on different ports.

## Security notes

- Admin sessions are HTTP-only, signed JWT cookies — never stored in
  localStorage and never readable by frontend JavaScript.
- Passwords are bcrypt-hashed; the plaintext password is never stored
  anywhere, including in `.env` (you generate the hash once and store only
  that — see `backend/README.md`).
- Login and public form submissions (booking, contact) are rate-limited.
- `helmet` sets sensible security headers; Zod validates every request body
  server-side (never trust client-side validation alone).
- Error responses never leak stack traces — verified during testing (see
  below).

## What was verified before delivery

- `npm install` and `npm run build` succeed in both `frontend/` and `backend/`.
- The backend was started with mocked config (no real database) and every
  route was exercised with curl: health check, validation errors, 401s on
  protected routes, 404 on unknown routes, and a full login → session
  cookie → protected request → logout → session-invalidated cycle — all
  behaved correctly and no stack traces leaked to the client.
- I do not have a real MongoDB instance available in this environment, so
  the actual database read/write paths (seed script, CRUD persistence)
  could not be exercised end-to-end here. Please run `npm run seed` and
  click through the admin dashboard once you've added your own
  `MONGODB_URI` — that's the one part of this build I couldn't verify
  myself before handing it to you.
