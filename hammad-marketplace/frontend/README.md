# Hammad Marketplace — Frontend

Next.js 16 + TypeScript + Tailwind storefront for Hammad Marketplace, fully wired to the
`../backend` API — no mock/static catalog data.

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # if present, or create with NEXT_PUBLIC_API_URL
npm run dev
```

Open http://localhost:3000. **The backend must be running** (see `../backend/README.md`) — this
app has no fallback mock data; product/category pages will show empty states until the API is up
and seeded.

`.env.local` should contain:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## What's wired to the real backend

- Auth: register/login/logout (customer or vendor), JWT stored client-side, `/api/auth/me` used to
  restore sessions
- Home, product listing (filter/search/sort), product detail pages — all fetched live from the API
- Cart & wishlist — persisted server-side per logged-in user (guests are redirected to log in when
  adding to cart/wishlist, since there's no guest cart merge logic in this build)
- Checkout — creates a real order via the API, runs the backend's demo payment step, decrements
  stock, applies coupons
- Order history + order detail pages
- Vendor dashboard (`/vendor/dashboard`, `/vendor/products`) — real stats, product CRUD with actual
  image upload to the backend
- Admin dashboard (`/admin/dashboard`, `/admin/vendors`, `/admin/products`, `/admin/orders`,
  `/admin/users`) — real analytics (Recharts), vendor approval, product visibility toggle, order
  status updates, customer management

## Known gaps (backend endpoints exist; frontend UI doesn't yet)

- Product reviews — API is live (`/api/reviews`), but there's no review form/list on the product
  page yet
- Coupon management UI for admins — the API is live (`/api/coupons`), only the checkout-side
  "enter a coupon code" flow is wired up
- Notifications — the `Notification` model/records are created by the backend (e.g. on order
  status change) but there's no bell/inbox UI to read them yet
- Address book management (saved addresses) — checkout takes a one-off address; the backend
  `addresses` array on `User` isn't exposed in the UI yet

## Roadmap from here

1. Product reviews UI on the PDP
2. Admin coupon management screen
3. Notification center
4. Saved addresses in account settings
5. Swap the demo payment step for real Stripe once you have API keys
