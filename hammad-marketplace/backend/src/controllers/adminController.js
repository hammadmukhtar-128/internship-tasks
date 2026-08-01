import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { ok, fail } from "../utils/apiResponse.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  return ok(res, users);
});

export const updateVendorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) return fail(res, "Invalid status", 400);

  const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });
  if (!vendor) return fail(res, "Vendor not found", 404);

  vendor.vendorProfile.status = status;
  await vendor.save();
  return ok(res, vendor.toSafeObject(), `Vendor ${status}`);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return fail(res, "User not found", 404);
  await user.deleteOne();
  await Product.deleteMany({ vendor: user._id });
  return ok(res, null, "User deleted");
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, product, "Product updated");
});
