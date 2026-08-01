import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";
import { ok, fail } from "../utils/apiResponse.js";

export const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return ok(res, coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  return ok(res, coupon, "Coupon created", 201);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) return fail(res, "Coupon not found", 404);
  return ok(res, coupon, "Coupon updated");
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return fail(res, "Coupon not found", 404);
  return ok(res, null, "Coupon deleted");
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon) return fail(res, "Invalid coupon code", 404);
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return fail(res, "Coupon has expired", 400);
  if (subtotal < coupon.minOrderValue) {
    return fail(res, `Minimum order of Rs ${coupon.minOrderValue} required`, 400);
  }
  const discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  return ok(res, { coupon, discount });
});
