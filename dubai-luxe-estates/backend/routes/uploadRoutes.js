const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, upload.array("images", 15), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }
  const paths = req.files.map((f) => `/images/uploads/${f.filename}`);
  res.status(201).json({ success: true, paths });
});

module.exports = router;
