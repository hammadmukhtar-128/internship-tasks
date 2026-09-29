const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    type: { type: String, enum: ["General", "Viewing", "Callback"], default: "General" },
    status: { type: String, enum: ["New", "Contacted", "Closed"], default: "New" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
