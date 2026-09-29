const express = require("express");
const {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} = require("../controllers/agentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getAgents).post(protect, createAgent);
router.route("/:id").get(getAgentById).put(protect, updateAgent).delete(protect, deleteAgent);

module.exports = router;
