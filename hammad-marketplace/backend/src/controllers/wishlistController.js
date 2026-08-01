import asyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist.js";
import { ok } from "../utils/apiResponse.js";

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
}

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate("products");
  return ok(res, wishlist);
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await getOrCreateWishlist(req.user._id);
  const idx = wishlist.products.findIndex((p) => p.toString() === productId);
  if (idx >= 0) wishlist.products.splice(idx, 1);
  else wishlist.products.push(productId);
  await wishlist.save();
  await wishlist.populate("products");
  return ok(res, wishlist);
});
