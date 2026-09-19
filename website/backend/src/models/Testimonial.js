import { Schema, model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    patientName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model("Testimonial", TestimonialSchema);
