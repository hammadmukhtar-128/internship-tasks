const express = require("express");
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require("../controllers/inquiryController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getInquiries).post(createInquiry);
router.route("/:id").put(protect, updateInquiryStatus).delete(protect, deleteInquiry);

module.exports = router;
