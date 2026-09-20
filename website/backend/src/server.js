import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import practitionerRoutes from "./routes/practitionerRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // required so the admin session cookie is sent/received
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// A generous global limiter as a backstop; individual routes (login,
// booking, contact) have their own stricter limits.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/practitioners", practitionerRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Clinic backend API running on http://localhost:${PORT}`);
    console.log(`Accepting requests from frontend origin: ${FRONTEND_URL}`);
  });
}

if (!process.env.VERCEL) {
  start();
}
