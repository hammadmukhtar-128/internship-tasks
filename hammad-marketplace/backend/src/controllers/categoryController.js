import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import { ok, fail } from "../utils/apiResponse.js";

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return ok(res, categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, image, tagline } = req.body;
  if (!name) return fail(res, "Category name is required", 400);
  const slug = slugify(name);
  const exists = await Category.findOne({ slug });
  if (exists) return fail(res, "Category already exists", 409);
  const category = await Category.create({ name, slug, image, tagline });
  return ok(res, category, "Category created", 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return fail(res, "Category not found", 404);
  const { name, image, tagline } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (image !== undefined) category.image = image;
  if (tagline !== undefined) category.tagline = tagline;
  await category.save();
  return ok(res, category, "Category updated");
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return fail(res, "Category not found", 404);
  await category.deleteOne();
  return ok(res, null, "Category deleted");
});
