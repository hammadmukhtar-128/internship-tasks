import { Router } from "express";
import {
  getServices,
  getAllServicesAdmin,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, serviceSchema } from "../utils/validators.js";

const router = Router();

router.get("/", getServices);
router.get("/admin", requireAdmin, getAllServicesAdmin); // before /:slug
router.post("/", requireAdmin, validateBody(serviceSchema), createService);
router.get("/:slug", getServiceBySlug);
router.patch("/:id", requireAdmin, validateBody(serviceSchema, { partial: true }), updateService);
router.delete("/:id", requireAdmin, deleteService);

export default router;
