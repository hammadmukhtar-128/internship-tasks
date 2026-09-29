# Lahore Estate Hub — Full-Stack Real Estate Platform

A premium real estate platform for the Lahore market: Next.js 15 + TypeScript frontend, Express + MongoDB backend, JWT-protected admin panel.

## What's included and working

**Frontend** (`/frontend`) — builds clean with `npm run build` (verified):
- Home, Properties (filter/sort/paginate), Property Detail (gallery, amenities, floor plan, nearby places, mortgage calculator, inquiry form, related properties), Communities (list + detail), Agents (list + detail with live listings), About, Blog (list + detail, category filter), Contact
- Admin panel: login (JWT), dashboard (live stats), Properties (full CRUD: create/list/delete), Inquiries (status update/delete), Agents & Blogs (list/delete — POST endpoint already live in the API, so a create form is a quick copy of the Properties one if you want it)
- Reusable components: Navbar, Footer, Hero w/ search, PropertyCard, AgentCard, BlogCard, CommunityCard, Testimonials slider, FAQ accordion, Newsletter, WhatsApp floating button, Back-to-top
- SEO: per-page metadata, Open Graph/Twitter cards, `robots.ts`, `sitemap.ts`, semantic alt text
- Framer Motion page/hero animations, `prefers-reduced-motion` respected

**Backend** (`/backend`) — boots clean, verified with `node server.js`:
- Mongoose models: Property, Agent, Blog, Inquiry, Admin (bcrypt-hashed passwords)
- REST API: full CRUD for properties/agents/blogs, inquiry capture + management, JWT auth, image upload endpoint (multer), dashboard stats endpoint
- `utils/seedData.js` — Lahore listings across DHA Lahore, Bahria Town Lahore, Gulberg, Johar Town, and Lake City, with agents, blog posts, and an admin user, ready to run once you connect a database

**Images**: `/frontend/public/images/img1.jpg` … `img45.jpg` are wired into every page per your folder spec. The included photography covers residential and lifestyle visuals for the Lahore property experience, with a few placeholder avatar and blog visuals retained where the source assets were not provided.

## What's a starting point, not "done"

Given the size of this brief (a full luxury real-estate platform is normally a multi-week build), I prioritized a fully working, coherent core over shallow stubs everywhere:
- Agent/Blog admin **create/edit forms** aren't built yet (delete works; create uses the same API pattern as Properties — happy to add these next)
- Dark mode toggle, image compare/save-to-favorites persistence, and Schema.org structured data aren't wired in yet
- Google Maps is a styled placeholder (needs your Google Maps API key)
- Deployed image storage is local disk (`/backend/public/images`) — fine for now per your spec; swap to S3/Cloudinary later if you outgrow it

None of this is hard — it's all the same patterns already in the codebase — just tell me which piece to build out next.

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# edit .env — put your real MongoDB URI, a random JWT_SECRET, and your admin email/password
npm install
npm run seed     # populates sample Lahore listings, agents, blog posts, admin user
npm run dev       # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev       # http://localhost:3000
```

Admin panel: `http://localhost:3000/admin/login` — use the ADMIN_EMAIL / ADMIN_PASSWORD you set in `backend/.env`.

## Deployment
- Frontend → Vercel: import `/frontend`, set `NEXT_PUBLIC_API_URL` to your deployed backend URL
- Backend → Render: import `/backend`, set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` as environment variables, start command `npm start`
