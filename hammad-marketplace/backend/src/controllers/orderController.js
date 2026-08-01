import asyncHandler from "express-async-handler";
import crypto from "crypto";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";
import { ok, fail } from "../utils/apiResponse.js";

function generateOrderNumber() {
  return `HM-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, couponCode, paymentMethod = "demo_card", simulatePaymentFailure } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return fail(res, "Cart is empty", 400);

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return fail(res, `${item.product.name} only has ${item.product.stock} in stock`, 400);
    }
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && subtotal >= coupon.minOrderValue && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
      appliedCoupon = coupon;
    }
  }

  const shippingFee = subtotal > 5000 ? 0 : 250;
  const total = Math.max(subtotal - discount, 0) + shippingFee;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product._id,
      vendor: i.product.vendor,
      name: i.product.name,
      image: i.product.image,
      price: i.product.price,
      quantity: i.quantity,
    })),
    shippingAddress,
    subtotal,
    shippingFee,
    discount,
    couponCode: appliedCoupon?.code,
    total,
    paymentMethod,
    status: "placed",
    statusHistory: [{ status: "placed" }],
  });

  // Demo payment simulation — stands in for Stripe until real API keys are configured.
  const paymentSucceeds = paymentMethod === "cash_on_delivery" || !simulatePaymentFailure;
  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    amount: total,
    method: paymentMethod,
    status: paymentSucceeds ? "success" : "failed",
    transactionRef: `TXN-${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
  });

  order.paymentStatus = paymentSucceeds ? "paid" : "failed";
  await order.save();

  if (paymentSucceeds) {
    for (const item of cart.items) {
      await Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } });
    }
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }
    cart.items = [];
    await cart.save();

    await Notification.create({
      user: req.user._id,
      title: "Order placed",
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      type: "order",
    });
  }

  return ok(res, { order, payment }, paymentSucceeds ? "Order placed" : "Payment failed", paymentSucceeds ? 201 : 402);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ok(res, orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return fail(res, "Order not found", 404);
  const isOwner = order.user.toString() === req.user._id.toString();
  const isVendorOnOrder = order.items.some((i) => i.vendor.toString() === req.user._id.toString());
  if (!isOwner && !isVendorOnOrder && req.user.role !== "admin") {
    return fail(res, "Not authorized to view this order", 403);
  }
  return ok(res, order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return fail(res, "Order not found", 404);

  const isVendorOnOrder = order.items.some((i) => i.vendor.toString() === req.user._id.toString());
  if (req.user.role !== "admin" && !isVendorOnOrder) {
    return fail(res, "Not authorized to update this order", 403);
  }

  order.status = status;
  order.statusHistory.push({ status });
  await order.save();

  await Notification.create({
    user: order.user,
    title: "Order status updated",
    message: `Your order ${order.orderNumber} is now "${status}".`,
    type: "order",
  });

  return ok(res, order, "Order status updated");
});

export const getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.vendor": req.user._id }).sort({ createdAt: -1 });
  return ok(res, orders);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  return ok(res, orders);
});
