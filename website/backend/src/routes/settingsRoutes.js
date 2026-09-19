import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, clinicSettingsSchema } from "../utils/validators.js";

const router = Router();

// Public GET: the frontend needs clinic name/contact/hours for footer & nav
// even for anonymous visitors. Only writes require admin auth.
router.get("/", getSettings);
router.put("/", requireAdmin, validateBody(clinicSettingsSchema), updateSettings);

export default router;
