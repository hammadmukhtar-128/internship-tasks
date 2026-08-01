import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { ok } from "../utils/apiResponse.js";

export const getVendorDashboard = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;

  const [productCount, orders] = await Promise.all([
    Product.countDocuments({ vendor: vendorId }),
    Order.find({ "items.vendor": vendorId, paymentStatus: "paid" }),
  ]);

  let revenue = 0;
  let unitsSold = 0;
  const orderIds = new Set();
  orders.forEach((order) => {
    orderIds.add(order._id.toString());
    order.items
      .filter((i) => i.vendor.toString() === vendorId.toString())
      .forEach((i) => {
        revenue += i.price * i.quantity;
        unitsSold += i.quantity;
      });
  });

  const lowStock = await Product.find({ vendor: vendorId, stock: { $lte: 5 } }).select("name stock");

  return ok(res, {
    productCount,
    orderCount: orderIds.size,
    revenue,
    unitsSold,
    lowStock,
  });
});

export const listVendors = asyncHandler(async (req, res) => {
  const User = (await import("../models/User.js")).default;
  const vendors = await User.find({ role: "vendor" }).select("-password");
  return ok(res, vendors);
});
