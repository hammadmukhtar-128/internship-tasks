const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    propertyType: {
      type: String,
      enum: ["House", "Apartment", "Villa", "Plot", "Commercial", "Office", "Shop"],
      required: true,
    },
    purpose: { type: String, enum: ["Buy", "Rent"], required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true },
    city: { type: String, default: "Lahore" },
    location: { type: String, required: true },
    community: { type: String, required: true, index: true },
    address: { type: String, default: "" },
    furnishing: { type: String, enum: ["Furnished", "Unfurnished", "Semi Furnished"], default: "Unfurnished" },
    amenities: [{ type: String }],
    images: [{ type: String, required: true }],
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Available", "Sold", "Rented", "Under Offer"],
      default: "Available",
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    nearby: {
      schools: [{ type: String }],
      hospitals: [{ type: String }],
      metro: [{ type: String }],
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    floorPlanImage: { type: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = slugify(`${this.title}-${Date.now()}`, { lower: true, strict: true });
  }
  next();
});

propertySchema.index({ title: "text", description: "text", community: "text", location: "text", city: "text" });

module.exports = mongoose.model("Property", propertySchema);
