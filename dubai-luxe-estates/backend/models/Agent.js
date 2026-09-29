const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String },
    experience: { type: Number, default: 1 }, // years
    languages: [{ type: String }],
    social: {
      linkedin: { type: String },
      instagram: { type: String },
      facebook: { type: String },
      twitter: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
