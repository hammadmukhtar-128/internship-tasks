import Practitioner from "../models/Practitioner.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getPractitioners = asyncHandler(async (req, res) => {
  const practitioners = await Practitioner.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  res.json({ items: practitioners });
});

// Admin: all practitioners including inactive — mounted at /practitioners/admin, before /:id
export const getAllPractitionersAdmin = asyncHandler(async (req, res) => {
  const practitioners = await Practitioner.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items: practitioners });
});

// Public: single practitioner by slug or Mongo _id
export const getPractitionerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
  const practitioner = await Practitioner.findOne({ ...query, isActive: true }).lean();
  if (!practitioner) return res.status(404).json({ error: "Practitioner not found." });
  res.json({ item: practitioner });
});

export const createPractitioner = asyncHandler(async (req, res) => {
  const existing = await Practitioner.findOne({ slug: req.body.slug });
  if (existing) {
    return res.status(409).json({ error: "A practitioner with this slug already exists." });
  }
  const practitioner = await Practitioner.create(req.body);
  res.status(201).json({ item: practitioner });
});

export const updatePractitioner = asyncHandler(async (req, res) => {
  const updated = await Practitioner.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Practitioner not found." });
  res.json({ item: updated });
});

export const deletePractitioner = asyncHandler(async (req, res) => {
  const deleted = await Practitioner.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Practitioner not found." });
  res.json({ success: true });
});
