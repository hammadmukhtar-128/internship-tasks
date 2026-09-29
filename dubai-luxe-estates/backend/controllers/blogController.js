const asyncHandler = require("express-async-handler");
const Blog = require("../models/Blog");

const getBlogs = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 6 } = req.query;
  const query = {};
  if (category) query.category = category;
  if (search) query.title = new RegExp(search, "i");

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
    Blog.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: blogs.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: blogs,
  });
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }
  const recent = await Blog.find({ _id: { $ne: blog._id } }).sort({ createdAt: -1 }).limit(3);
  res.json({ success: true, data: blog, recent });
});

const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }
  Object.assign(blog, req.body);
  await blog.save();
  res.json({ success: true, data: blog });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog post not found");
  }
  await blog.deleteOne();
  res.json({ success: true, message: "Blog post removed" });
});

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
