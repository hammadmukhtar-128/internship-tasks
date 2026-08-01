import { Router } from "express";
import { listUsers, updateVendorStatus, deleteUser, adminUpdateProduct } from "../controllers/adminController.js";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("admin"));

router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);
router.put("/vendors/:id/status", updateVendorStatus);
router.put("/products/:id", adminUpdateProduct);
router.get("/analytics", getAdminAnalytics);

export default router;
