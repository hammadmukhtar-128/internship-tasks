const asyncHandler = require("express-async-handler");
const Agent = require("../models/Agent");
const Property = require("../models/Property");

const getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find().sort({ createdAt: -1 });
  res.json({ success: true, count: agents.length, data: agents });
});

const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }
  const listings = await Property.find({ agent: agent._id });
  res.json({ success: true, data: agent, listings });
});

const createAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.create(req.body);
  res.status(201).json({ success: true, data: agent });
});

const updateAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }
  Object.assign(agent, req.body);
  await agent.save();
  res.json({ success: true, data: agent });
});

const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    res.status(404);
    throw new Error("Agent not found");
  }
  await agent.deleteOne();
  res.json({ success: true, message: "Agent removed" });
});

module.exports = { getAgents, getAgentById, createAgent, updateAgent, deleteAgent };
