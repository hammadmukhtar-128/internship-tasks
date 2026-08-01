import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { ok } from "../utils/apiResponse.js";

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const paidOrders = await Order.find({ paymentStatus: "paid" });

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const [customerCount, vendorCount, productCount, orderCount] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "vendor" }),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const salesByDay = {};
  paidOrders.forEach((o) => {
    const day = o.createdAt.toISOString().slice(0, 10);
    salesByDay[day] = (salesByDay[day] || 0) + o.total;
  });
  const dailySales = Object.entries(salesByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));

  const productSales = {};
  paidOrders.forEach((o) => {
    o.items.forEach((i) => {
      productSales[i.name] = (productSales[i.name] || 0) + i.quantity;
    });
  });
  const bestSellers = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, unitsSold]) => ({ name, unitsSold }));

  return ok(res, {
    revenue,
    customerCount,
    vendorCount,
    productCount,
    orderCount,
    dailySales,
    bestSellers,
  });
});
