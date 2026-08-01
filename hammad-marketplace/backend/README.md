# Hammad Marketplace — Backend

Express + MongoDB (Mongoose) REST API for Hammad Marketplace, with JWT authentication and
role-based access control (customer / vendor / admin).

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGO_URI and JWT_SECRET
npm run seed            # populates categories, vendors, admin, demo customer, and 28 products
npm run dev              # starts the API on http://localhost:5000
```

Requires a MongoDB instance — either local (`mongodb://127.0.0.1:27017/hammad_marketplace`) or a
free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (put its connection string in
`MONGO_URI`).

> **Note:** this backend was built and syntax/boot-checked in a sandboxed environment without
> network access to MongoDB's servers, so it could not be run end-to-end against a live database
> before delivery. Run `npm run seed` after connecting a real MongoDB instance to fully verify it,
> and open an issue/message back if anything doesn't behave as expected.

## Demo accounts (after seeding)

| Role     | Email                          | Password       |
|----------|----------------------------------|----------------|
| Admin    | admin@hammad.test                | Admin@12345    |
| Vendor   | vendor.northwind@hammad.test     | Vendor@12345   |
| Customer | customer@hammad.test             | Customer@12345 |

(4 more seeded vendors: `vendor.studioloom@`, `vendor.craftline@`, `vendor.hearth@`,
`vendor.botanica@` — all `@hammad.test` with password `Vendor@12345`)

## API overview

Base URL: `http://localhost:5000/api`

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`
- `GET /products`, `GET /products/:slug`, `POST /products` (vendor/admin, multipart image upload),
  `PUT /products/:id`, `DELETE /products/:id`, `GET /products/vendor/mine`
- `GET /categories`, `POST/PUT/DELETE /categories` (admin)
- `GET/POST/PUT/DELETE /cart` (auth required)
- `GET /wishlist`, `POST /wishlist/toggle` (auth required)
- `POST /orders` (checkout — creates order + runs demo payment), `GET /orders/mine`,
  `GET /orders/vendor`, `GET /orders/admin`, `PUT /orders/:id/status`
- `GET /reviews/product/:productId`, `POST /reviews`, `DELETE /reviews/:id`
- `POST /coupons/validate`, full CRUD under `/coupons` (admin)
- `GET /vendors/dashboard` (vendor stats), `GET /vendors` (admin)
- `GET /admin/users`, `PUT /admin/vendors/:id/status`, `DELETE /admin/users/:id`,
  `PUT /admin/products/:id`, `GET /admin/analytics`

## Design notes / known simplifications

- **Payments are simulated**, not a live Stripe integration — no real payment gateway keys were
  provided, so `POST /orders` runs a demo payment step that succeeds or fails based on the
  `simulatePaymentFailure` flag, and records the result in the `Payment` collection. Swapping in
  real Stripe later means replacing the payment step in `orderController.js` with a Stripe
  PaymentIntent call — the rest of the order flow doesn't need to change.
- **Order items are embedded** in the `Order` document rather than a separate `OrderItem`
  collection — simpler to query and consistent with how most production marketplaces model this.
- **Vendors are `User` documents with `role: "vendor"`** plus a `vendorProfile` subdocument,
  rather than a fully separate `Vendor` collection — keeps auth simple since a vendor logs in the
  same way a customer does.
- **Password reset returns the token directly in the API response** instead of emailing it, since
  no email service (SMTP/SendGrid/etc.) was configured. Wire up an email provider in
  `authController.js` (`forgotPassword`) to send it for real.
- Uploaded product images are stored on local disk under `backend/uploads/` and served at
  `/uploads/...`. For production, swap `multer`'s disk storage for an S3/Cloudinary adapter.

## Folder structure

```
src/
  config/      MongoDB connection
  models/      Mongoose schemas
  controllers/ Route handlers / business logic
  middleware/  auth (JWT), role authorization, multer upload, error handler
  routes/      Express routers
  utils/       token generation, response helpers
  seed/        database seed script
```
