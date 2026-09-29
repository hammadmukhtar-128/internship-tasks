const asyncHandler = require("express-async-handler");
const Inquiry = require("../models/Inquiry");

const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  res.status(201).json({ success: true, data: inquiry });
});

const getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().populate("propertyId", "title slug").sort({ createdAt: -1 });
  res.json({ success: true, count: inquiries.length, data: inquiries });
});

const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  inquiry.status = req.body.status || inquiry.status;
  await inquiry.save();
  res.json({ success: true, data: inquiry });
});

const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error("Inquiry not found");
  }
  await inquiry.deleteOne();
  res.json({ success: true, message: "Inquiry removed" });
});

module.exports = { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry };
