const express = require("express");
const {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getProperties).post(protect, createProperty);
router.route("/:id").put(protect, updateProperty).delete(protect, deleteProperty);
router.get("/slug/:slug", getPropertyBySlug);

module.exports = router;
