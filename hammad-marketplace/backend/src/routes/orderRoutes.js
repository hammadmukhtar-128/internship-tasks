import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getVendorOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.post("/", createOrder);
router.get("/mine", getMyOrders);
router.get("/vendor", authorize("vendor", "admin"), getVendorOrders);
router.get("/admin", authorize("admin"), getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", authorize("vendor", "admin"), updateOrderStatus);

export default router;
