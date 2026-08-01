import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { ok, fail } from "../utils/apiResponse.js";

async function recalcRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, { rating: Math.round(avg * 10) / 10, reviewCount: count });
}

export const listProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  return ok(res, reviews);
});

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const product = await Product.findById(productId);
  if (!product) return fail(res, "Product not found", 404);

  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) return fail(res, "You already reviewed this product", 409);

  const review = await Review.create({ product: productId, user: req.user._id, rating, comment });
  await recalcRating(productId);
  return ok(res, review, "Review submitted", 201);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return fail(res, "Review not found", 404);
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return fail(res, "Not authorized", 403);
  }
  const productId = review.product;
  await review.deleteOne();
  await recalcRating(productId);
  return ok(res, null, "Review deleted");
});
