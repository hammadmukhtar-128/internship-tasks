const express = require("express");
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);
router.route("/:id").put(protect, updateBlog).delete(protect, deleteBlog);
router.get("/slug/:slug", getBlogBySlug);

module.exports = router;
