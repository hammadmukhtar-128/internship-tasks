import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { sendContactNotification } from "../utils/email.js";

const VALID_STATUSES = ["new", "read", "replied"];

export const sendMessage = asyncHandler(async (req, res) => {
  await ContactMessage.create({ ...req.body, status: "new" });
  await sendContactNotification(req.body);
  res.status(201).json({ success: true });
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items: messages });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  if (!VALID_STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  const updated = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ error: "Message not found." });
  res.json({ item: updated });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const deleted = await ContactMessage.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Message not found." });
  res.json({ success: true });
});
