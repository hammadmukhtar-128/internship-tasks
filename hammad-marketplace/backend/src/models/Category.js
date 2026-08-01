import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    image: String,
    tagline: String,
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
