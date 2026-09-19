import Service from "../models/Service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Public: list active services
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  res.json({ items: services });
});

// Admin: list all (including inactive) — mounted at /services/admin, before /:slug
export const getAllServicesAdmin = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items: services });
});

// Public: one active service by slug
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!service) return res.status(404).json({ error: "Service not found." });
  res.json({ item: service });
});

export const createService = asyncHandler(async (req, res) => {
  const existing = await Service.findOne({ slug: req.body.slug });
  if (existing) {
    return res.status(409).json({ error: "A service with this slug already exists." });
  }
  const service = await Service.create(req.body);
  res.status(201).json({ item: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Service not found." });
  res.json({ item: updated });
});

export const deleteService = asyncHandler(async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Service not found." });
  res.json({ success: true });
});
