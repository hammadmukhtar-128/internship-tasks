const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const Agent = require("../models/Agent");
const Blog = require("../models/Blog");
const Inquiry = require("../models/Inquiry");

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProperties, totalAgents, totalBlogs, totalInquiries, newInquiries, featuredCount, recentInquiries] =
    await Promise.all([
      Property.countDocuments(),
      Agent.countDocuments(),
      Blog.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "New" }),
      Property.countDocuments({ featured: true }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    success: true,
    data: {
      totalProperties,
      totalAgents,
      totalBlogs,
      totalInquiries,
      newInquiries,
      featuredCount,
      recentInquiries,
    },
  });
});

module.exports = { getDashboardStats };
