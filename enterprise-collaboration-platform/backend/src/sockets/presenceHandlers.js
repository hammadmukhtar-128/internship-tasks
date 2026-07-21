const User = require('../models/User');
const Team = require('../models/Team');
const logger = require('../config/logger');

// In-memory map of userId -> Set of active socket ids (supports multi-tab/device)
const activeConnections = new Map();

function addConnection(userId, socketId) {
  if (!activeConnections.has(userId)) activeConnections.set(userId, new Set());
  activeConnections.get(userId).add(socketId);
  return activeConnections.get(userId).size === 1; // true if this is the user's first connection
}

function removeConnection(userId, socketId) {
  if (!activeConnections.has(userId)) return true;
  const set = activeConnections.get(userId);
  set.delete(socketId);
  if (set.size === 0) {
    activeConnections.delete(userId);
    return true; // true if user has no more active connections
  }
  return false;
}

function isOnline(userId) {
  return activeConnections.has(userId);
}

async function broadcastPresenceToUserTeams(io, userId, status) {
  try {
    const teams = await Team.find({ 'members.user': userId }).select('_id');
    teams.forEach((team) => {
      io.to(`team:${team._id}`).emit('presence:update', { userId, status, lastSeen: new Date() });
    });
  } catch (err) {
    logger.error(`[presence] broadcast failed: ${err.message}`);
  }
}

function registerPresenceHandlers(io, socket) {
  const userId = socket.user._id.toString();

  socket.on('presence:set', async ({ status }) => {
    if (!['online', 'away', 'offline'].includes(status)) return;
    await User.findByIdAndUpdate(userId, { status, lastSeen: new Date() });
    await broadcastPresenceToUserTeams(io, userId, status);
  });

  socket.on('disconnect', async () => {
    const fullyDisconnected = removeConnection(userId, socket.id);
    if (fullyDisconnected) {
      await User.findByIdAndUpdate(userId, { status: 'offline', lastSeen: new Date() });
      await broadcastPresenceToUserTeams(io, userId, 'offline');
      logger.info(`[socket] user ${userId} fully disconnected`);
    }
  });
}

module.exports = {
  registerPresenceHandlers,
  addConnection,
  removeConnection,
  isOnline,
  broadcastPresenceToUserTeams,
};
