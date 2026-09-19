import { Schema, model } from "mongoose";

const PractitionerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    qualifications: { type: [String], default: [] },
    experience: { type: String, default: "" },
    bio: { type: String, required: true },
    shortBio: { type: String, required: true },
    image: { type: String, default: "" },
    services: { type: [String], default: [] },
    languages: { type: [String], default: ["English"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("Practitioner", PractitionerSchema);
