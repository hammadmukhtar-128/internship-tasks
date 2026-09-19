import { Router } from "express";
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, testimonialSchema } from "../utils/validators.js";

const router = Router();

router.get("/", getTestimonials);
router.get("/admin", requireAdmin, getAllTestimonialsAdmin);
router.post("/", requireAdmin, validateBody(testimonialSchema), createTestimonial);
router.patch("/:id", requireAdmin, validateBody(testimonialSchema, { partial: true }), updateTestimonial);
router.delete("/:id", requireAdmin, deleteTestimonial);

export default router;
