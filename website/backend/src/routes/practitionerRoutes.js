import { Router } from "express";
import {
  getPractitioners,
  getAllPractitionersAdmin,
  getPractitionerById,
  createPractitioner,
  updatePractitioner,
  deletePractitioner,
} from "../controllers/practitionerController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, practitionerSchema } from "../utils/validators.js";

const router = Router();

router.get("/", getPractitioners);
router.get("/admin", requireAdmin, getAllPractitionersAdmin); // before /:id
router.post("/", requireAdmin, validateBody(practitionerSchema), createPractitioner);
router.get("/:id", getPractitionerById);
router.patch("/:id", requireAdmin, validateBody(practitionerSchema, { partial: true }), updatePractitioner);
router.delete("/:id", requireAdmin, deletePractitioner);

export default router;
