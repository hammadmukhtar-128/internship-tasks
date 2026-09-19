# Clinic Website — Frontend (React + Vite)

A standalone, frontend-only React application for a physiotherapy and
chiropractic clinic. Built with Vite, React Router, Tailwind CSS, Framer
Motion, Axios, React Hook Form + Zod, and react-helmet-async for SEO.

**This project contains no backend, no database connection, and no server
code of any kind** — by design, per spec. It communicates exclusively with a
REST API through the Axios service layer in `src/services/`.

A matching Express + MongoDB backend now lives alongside this folder at
`../backend/` (see `../README.md` at the website root for how the two run
together). This document still describes the frontend on its own terms —
everything below is equally true whether or not `../backend/` exists.

## Why no database connection string goes here

A database connection string must never live in frontend code — anything in
`frontend/` is bundled and shipped to the browser, where anyone can read it
via dev tools. That's true even of environment variables prefixed
`VITE_` (Vite inlines them into the built JS). Keep `MONGODB_URI` — and any
other secret — in your backend's own `.env`, never in this project.

## Working without a backend yet

Every data-fetching function in `src/services/*.js` tries the real API first
and falls back to realistic demo content in `src/utils/demoData.js` if the
request fails. That means:

- The public site (Home, Services, Team, etc.) looks complete and populated
  right now, with zero backend running.
- The booking and contact forms build correctly and validate input, but will
  show a "couldn't reach the server" toast until a real backend exists at
  `VITE_API_URL`.
- The admin dashboard shows an amber "backend not reachable" banner and
  disables persistence until your Express API is live — the UI is fully
  built and ready to go the moment it is.

Once your backend is running and reachable at `VITE_API_URL`, everything
switches to live data automatically — no frontend code changes needed.

## Tech stack

- React 18 + Vite 5 (JavaScript, not TypeScript)
- React Router DOM 6
- Tailwind CSS 3
- Framer Motion (subtle animation utility classes are already in place;
  wire up `motion.div` where you'd like more movement)
- Axios (single shared instance in `src/services/api.js`)
- React Hook Form + Zod (shared schemas in `src/utils/validations.js`)
- Lucide React (icons)
- react-helmet-async (per-page SEO: title, meta description, canonical, OG tags)

## Project structure

```
frontend/
├── public/
│   └── images/clinic/          Your clinic photos
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             Button, Input, Modal, Toast, Seo, etc.
│   │   ├── layout/              Navbar, Footer, MobileCtaBar
│   │   ├── home/                Homepage sections
│   │   ├── services/            ServiceCard
│   │   ├── booking/              BookingWizard, ContactForm
│   │   ├── team/                 PractitionerCard
│   │   └── admin/                AdminSidebar, AdminLayout, AdminTable, ProtectedRoute
│   ├── pages/
│   │   ├── Home.jsx, About.jsx, Services.jsx, ServiceDetails.jsx,
│   │   │   Team.jsx, PractitionerDetails.jsx, BookAppointment.jsx,
│   │   │   Contact.jsx, FAQs.jsx, PrivacyPolicy.jsx, Terms.jsx, NotFound.jsx
│   │   └── admin/
│   │       Login.jsx, Dashboard.jsx, Appointments.jsx, Services.jsx,
│   │       Practitioners.jsx, Testimonials.jsx, Messages.jsx, Settings.jsx
│   ├── services/                Axios API layer (api.js + one file per resource)
│   ├── context/                 AuthContext, SettingsContext
│   ├── hooks/                   (empty — add shared hooks here as needed)
│   ├── utils/                   cn, format, constants, validations, demoData
│   ├── App.jsx                  All routing (React Router)
│   ├── main.jsx                 Providers + mount
│   └── index.css
├── package.json
├── vite.config.js
└── .env.example
```

## API contract this frontend expects

Build your backend to match these routes and this frontend needs zero
changes:

| Route | Method | Notes |
|---|---|---|
| `/services` | GET | List active services |
| `/services/admin` | GET | Admin: all services, including inactive |
| `/services/:slug` | GET | One service |
| `/practitioners` | GET | List active practitioners |
| `/practitioners/admin` | GET | Admin: all practitioners, including inactive |
| `/practitioners/:id` | GET | One practitioner (by slug or id) |
| `/testimonials` | GET | Published testimonials |
| `/testimonials/admin` | GET | Admin: all testimonials, including unpublished |
| `/appointments` | POST | Create a booking (public) |
| `/appointments` | GET | List all (admin) |
| `/appointments/:id` | PATCH | Update status (admin) |
| `/appointments/:id` | DELETE | Delete (admin) |
| `/contact` | POST | Send a message (public) |
| `/contact` | GET / PATCH / DELETE | Manage messages (admin) |
| `/settings` | GET / PUT | Clinic settings (admin) |
| `/auth/login` | POST | `{ email, password }` → sets session cookie |
| `/auth/logout` | POST | Clears session |
| `/auth/me` | GET | Returns current admin or 401 |

Expected response shape is `{ items: [...] }` for lists and `{ item: {...} }`
for singles (the service layer also accepts a bare array/object as a
fallback). Admin auth is expected to use an **HTTP-only session cookie** —
the Axios instance sends `withCredentials: true` — so your backend should set
`Set-Cookie` on login rather than returning a token for the frontend to store
(this project intentionally does not implement localStorage-based auth, per
your spec).

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

Output goes to `dist/` — deploy this to any static host (Netlify, Vercel,
S3 + CloudFront, etc.) once your backend is deployed and `VITE_API_URL`
points at it.

## Images

Your uploaded photos are in `public/images/clinic/`. One image from your
original upload (a night exterior shot of an unrelated, already-branded
business) was intentionally left out rather than used for this clinic.
Practitioner headshots use clean initials avatars rather than reusing the
same practitioner's photo for three different named team members — swap in
real individual headshots per practitioner when available.

## Notes on fonts

Google Fonts couldn't be fetched in this build sandbox (no internet access
to fonts.googleapis.com), so the project uses system font stacks — it still
looks polished. To restore the Inter + Fraunces pairing used in the design,
add `@import` rules for them to `src/index.css` or install
`@fontsource/inter` and `@fontsource/fraunces` once you have network access.

## What's intentionally not here

Per your spec, this project contains no `server/`, no Express app, no
MongoDB/Mongoose, no backend controllers or routes, and no database
credentials. All of that is expected to be built separately and connected
via `VITE_API_URL`.
