import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { ok, fail } from "../utils/apiResponse.js";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const listProducts = asyncHandler(async (req, res) => {
  const { category, q, sort, minPrice, maxPrice, vendor, page = 1, limit = 24, includeInactive } = req.query;
  const filter = includeInactive === "true" ? {} : { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
    else filter.category = null;
  }
  if (vendor) filter.vendor = vendor;
  if (q) filter.$text = { $search: q };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("vendor", "name vendorProfile.shopName")
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return ok(res, { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category", "name slug")
    .populate("vendor", "name vendorProfile.shopName");
  if (!product) return fail(res, "Product not found", 404);

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4);

  return ok(res, { product, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  const vendorId = req.user.role === "admin" && body.vendor ? body.vendor : req.user._id;

  const category = await Category.findOne({ slug: body.categorySlug });
  if (!category) return fail(res, "Invalid category", 400);

  let slug = slugify(body.name);
  const exists = await Product.findOne({ slug });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  const image = req.file ? `/uploads/products/${req.file.filename}` : body.image;
  if (!image) return fail(res, "Product image is required", 400);

  const product = await Product.create({
    name: body.name,
    slug,
    description: body.description,
    bullets: body.bullets ? JSON.parse(body.bullets) : [],
    price: Number(body.price),
    compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
    category: category._id,
    vendor: vendorId,
    image,
    stock: Number(body.stock) || 0,
    badge: body.badge || null,
  });

  return ok(res, product, "Product created", 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, "Product not found", 404);

  const isOwner = product.vendor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") return fail(res, "Not authorized to edit this product", 403);

  const body = req.body;
  if (body.categorySlug) {
    const category = await Category.findOne({ slug: body.categorySlug });
    if (!category) return fail(res, "Invalid category", 400);
    product.category = category._id;
  }
  if (req.file) product.image = `/uploads/products/${req.file.filename}`;

  ["name", "description", "price", "compareAtPrice", "stock", "badge", "isActive"].forEach((field) => {
    if (body[field] !== undefined) product[field] = body[field];
  });
  if (body.bullets) product.bullets = JSON.parse(body.bullets);

  await product.save();
  return ok(res, product, "Product updated");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, "Product not found", 404);

  const isOwner = product.vendor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") return fail(res, "Not authorized to delete this product", 403);

  await product.deleteOne();
  return ok(res, null, "Product deleted");
});

export const listVendorProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id }).populate("category", "name slug").sort({ createdAt: -1 });
  return ok(res, products);
});
