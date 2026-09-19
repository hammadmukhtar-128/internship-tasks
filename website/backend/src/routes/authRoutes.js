import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, adminLoginSchema } from "../utils/validators.js";

const router = Router();

// Limit login attempts to slow down brute-force guessing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

router.post("/login", loginLimiter, validateBody(adminLoginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

export default router;
