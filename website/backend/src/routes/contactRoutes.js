import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendMessage, getMessages, updateMessageStatus, deleteMessage } from "../controllers/contactController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateBody, contactSchema } from "../utils/validators.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later or call us directly." },
});

router.post("/", contactLimiter, validateBody(contactSchema), sendMessage);
router.get("/", requireAdmin, getMessages);
router.patch("/:id", requireAdmin, updateMessageStatus);
router.delete("/:id", requireAdmin, deleteMessage);

export default router;
