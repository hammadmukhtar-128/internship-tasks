import { Router } from "express";
import {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  listVendorProducts,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listProducts);
router.get("/vendor/mine", protect, authorize("vendor", "admin"), listVendorProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, authorize("vendor", "admin"), upload.single("image"), createProduct);
router.put("/:id", protect, authorize("vendor", "admin"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorize("vendor", "admin"), deleteProduct);

export default router;
