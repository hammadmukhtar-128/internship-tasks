import Testimonial from "../models/Testimonial.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
  res.json({ items: testimonials });
});

// Admin: all testimonials including unpublished — mounted at /testimonials/admin
export const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items: testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ item: testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Testimonial not found." });
  res.json({ item: updated });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const deleted = await Testimonial.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ error: "Testimonial not found." });
  res.json({ success: true });
});
