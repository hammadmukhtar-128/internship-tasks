# Hammad Marketplace

A full-stack multi-vendor e-commerce platform.

```
/frontend   Next.js 16 + TypeScript + Tailwind storefront, vendor dashboard, admin dashboard
/backend    Express + MongoDB REST API, JWT auth, role-based access control
```

## Quick start

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env    # edit MONGO_URI to point at your MongoDB (local or Atlas)
npm run seed
npm run dev              # http://localhost:5000
```

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
```

Log in with one of the seeded demo accounts (see `backend/README.md`) to try the customer,
vendor, and admin experiences.

## What this is

A working, real full-stack build: MongoDB-backed catalog, JWT auth with three roles, a working
cart/wishlist/checkout flow with demo payment simulation, a vendor dashboard with real product
CRUD and image upload, and an admin dashboard with live analytics, vendor approval, and order
management. See each package's README for what's fully wired up versus still a follow-up item —
a project this size always has a "what's next" list, and it's written down rather than hidden.
