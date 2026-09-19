import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, appointmentSchema } from "../utils/validators.js";

const router = Router();

// Limit public booking submissions to reduce spam/abuse.
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many booking requests. Please try again later or call us directly." },
});

router.post("/", bookingLimiter, validateBody(appointmentSchema), createAppointment);
router.get("/", requireAdmin, getAppointments);
router.patch("/:id", requireAdmin, updateAppointmentStatus);
router.delete("/:id", requireAdmin, deleteAppointment);

export default router;
