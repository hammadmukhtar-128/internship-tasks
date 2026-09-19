import ClinicSettings from "../models/ClinicSettings.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Public: needed by the frontend's SettingsContext for footer/contact info
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await ClinicSettings.findOne({}).lean();
  res.json({ item: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const updated = await ClinicSettings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  }).lean();
  res.json({ item: updated });
});
