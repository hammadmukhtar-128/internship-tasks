import { Schema, model } from "mongoose";

const OpeningHourSchema = new Schema(
  {
    day: { type: String, required: true },
    hours: { type: String, required: true },
  },
  { _id: false }
);

const ClinicSettingsSchema = new Schema(
  {
    clinicName: { type: String, required: true, default: "Your Clinic Name" },
    tagline: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    suburb: { type: String, default: "" },
    state: { type: String, default: "" },
    postcode: { type: String, default: "" },
    openingHours: { type: [OpeningHourSchema], default: [] },
    googleMapsUrl: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    emergencyMessage: { type: String, default: "" },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default model("ClinicSettings", ClinicSettingsSchema);
