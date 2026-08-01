import { Router } from "express";
import { getVendorDashboard, listVendors } from "../controllers/vendorController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", protect, authorize("vendor"), getVendorDashboard);
router.get("/", protect, authorize("admin"), listVendors);

export default router;
