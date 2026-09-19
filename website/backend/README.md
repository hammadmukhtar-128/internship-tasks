# Clinic Backend — Express + MongoDB API

REST API for the clinic website. Express 4, Mongoose 8, cookie-based JWT
admin auth, Zod validation, Nodemailer notifications, rate limiting, and
Helmet security headers.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

- **MONGODB_URI** — required. Your MongoDB Atlas connection string, pointing
  at a database named `clinic_management`:
  ```
  mongodb+srv://USERNAME:PASSWORD@cluster0.xxxx.mongodb.net/clinic_management
  ```
- **FRONTEND_URL** — the exact origin of your frontend (no trailing slash),
  e.g. `http://localhost:5173` in dev. CORS is locked to this one origin.
- **ADMIN_EMAIL** — the email address you'll log in with.
- **ADMIN_PASSWORD_HASH** — a bcrypt hash of your admin password, generated with:
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
  ```
  Never put the plaintext password in `.env` — only the hash.
- **JWT_SECRET** — any long random string, used to sign session cookies.
- **SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD / SMTP_FROM** —
  optional. If left blank, booking and contact submissions still work; they
  just skip sending email notifications (logged server-side, never fatal).

```bash
npm run seed   # populates services, practitioners, testimonials, clinic settings
npm run dev    # starts the API with nodemon (auto-restart on change)
```

Production:

```bash
npm start
```

## Project structure

```
backend/
├── src/
│   ├── server.js              Express app entry point
│   ├── config/db.js           Mongoose connection
│   ├── models/                Service, Practitioner, Appointment,
│   │                          Testimonial, ContactMessage, ClinicSettings
│   ├── controllers/           Business logic per resource
│   ├── routes/                Route definitions + middleware wiring
│   ├── middleware/
│   │   ├── auth.js            JWT sign/verify, requireAdmin, cookie config
│   │   └── errorHandler.js    Central error handling (never leaks stack traces)
│   └── utils/
│       ├── validators.js      Zod schemas + validateBody middleware
│       └── email.js           Nodemailer (no-ops safely if SMTP unset)
├── scripts/seed.js             npm run seed
├── package.json
└── .env.example
```

## API routes

All routes are mounted under `/api`. Admin routes require a valid session
cookie (set by `/auth/login`); the frontend's Axios instance sends this
automatically via `withCredentials: true`.

| Route | Method | Auth | Notes |
|---|---|---|---|
| `/health` | GET | — | Health check |
| `/auth/login` | POST | — | Rate-limited (10/15min). Sets session cookie. |
| `/auth/logout` | POST | — | Clears session cookie. |
| `/auth/me` | GET | admin | Returns `{ email }` or 401. |
| `/services` | GET | — | Active services only. |
| `/services/admin` | GET | admin | All services, including inactive. |
| `/services/:slug` | GET | — | One active service. |
| `/services` | POST | admin | Create. |
| `/services/:id` | PATCH | admin | Partial update. |
| `/services/:id` | DELETE | admin | Delete. |
| `/practitioners` | GET | — | Active practitioners only. |
| `/practitioners/admin` | GET | admin | All practitioners, including inactive. |
| `/practitioners/:id` | GET | — | One active practitioner (by slug or Mongo `_id`). |
| `/practitioners` | POST | admin | Create. |
| `/practitioners/:id` | PATCH | admin | Partial update. |
| `/practitioners/:id` | DELETE | admin | Delete. |
| `/testimonials` | GET | — | Published testimonials only. |
| `/testimonials/admin` | GET | admin | All testimonials, including unpublished. |
| `/testimonials` | POST | admin | Create. |
| `/testimonials/:id` | PATCH | admin | Partial update. |
| `/testimonials/:id` | DELETE | admin | Delete. |
| `/appointments` | POST | — | Create a booking. Rate-limited (20/hour). |
| `/appointments` | GET | admin | List, with optional `?status=` and `?search=`. |
| `/appointments/:id` | PATCH | admin | Update status. |
| `/appointments/:id` | DELETE | admin | Delete. |
| `/contact` | POST | — | Send a message. Rate-limited (20/hour). |
| `/contact` | GET | admin | List all messages. |
| `/contact/:id` | PATCH | admin | Update status (new/read/replied). |
| `/contact/:id` | DELETE | admin | Delete. |
| `/settings` | GET | — | Public: clinic name/contact/hours for the site footer. |
| `/settings` | PUT | admin | Update (upserts if none exists yet). |

Every list endpoint returns `{ items: [...] }`; every single-resource
endpoint returns `{ item: {...} }` — matching what the frontend's service
layer expects.

## Design decisions worth knowing about

- **`/services/admin` and `/practitioners/admin` are separate routes from
  `/services` and `/practitioners`**, not a query parameter on the same
  route. This is deliberate: the public routes only ever return
  `isActive: true` documents by design (no way to accidentally leak
  deactivated content to anonymous visitors), while the admin dashboard
  needs to see and manage inactive/unpublished items too. The route is
  registered before `/:slug` / `/:id` so Express doesn't try to treat
  `"admin"` as an ID.
- **`GET /settings` is intentionally public**, not admin-only — the
  frontend's navbar/footer need the clinic's name, phone and hours for every
  visitor, not just logged-in admins. Only `PUT /settings` requires auth.
- **Auth is a signed, HTTP-only JWT cookie**, never a token handed to
  frontend JavaScript to store in localStorage — this was an explicit
  requirement from the frontend spec, and it's also just better practice
  (immune to XSS token theft).
- **Validation happens twice**: Zod validates on the frontend for instant
  feedback, and again here on the backend via the same schema shapes,
  because client-side validation can always be bypassed by anyone calling
  the API directly.

## What I verified before handing this to you

I don't have a real MongoDB instance available in the environment I built
this in, so I could not run `npm run seed` or exercise actual database
reads/writes end-to-end. What I *did* verify, using a temporary
DB-bypassed instance of this exact code:

- Every route responds with the correct status code and shape: 200/201 on
  success, 400 on invalid input (with the specific Zod error message), 401
  on missing/invalid admin sessions, 404 on unknown routes and missing
  resources, 500 with a generic message (never a stack trace) when the
  database call itself fails.
- The full login → cookie issued → protected route accepted → logout →
  session invalidated cycle, using a real bcrypt hash and JWT.
- All backend files pass `node --check` (syntax validation) with no errors.

Please run `npm run seed` against your own database and click through the
admin dashboard once — that's the one part of this build I genuinely
couldn't test myself without a live MongoDB connection.
