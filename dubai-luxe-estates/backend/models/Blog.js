const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Lahore Estate Hub" },
  },
  { timestamps: true }
);

blogSchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
