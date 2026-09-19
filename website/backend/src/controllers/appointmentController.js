import Appointment from "../models/Appointment.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { sendAppointmentNotification } from "../utils/email.js";

const VALID_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

// Public: create a booking request
export const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, status: "pending" });

  const emailResult = await sendAppointmentNotification(req.body);

  res.status(201).json({ id: appointment._id, emailSent: emailResult.sent });
});

// Admin: list with optional status/search filters
export const getAppointments = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const query = {};
  if (status && status !== "all") query.status = status;
  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  const appointments = await Appointment.find(query).sort({ createdAt: -1 }).lean();
  res.json({ items: appointments });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  if (!VALID_STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ error: "Appointment not found." });
  res.json({ item: updated });
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const deleted = await Appointment.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Appointment not found." });
  res.json({ success: true });
});
