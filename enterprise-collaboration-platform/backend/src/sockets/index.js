const { Server } = require('socket.io');
const socketAuth = require('./socketAuth');
const { registerChatHandlers } = require('./chatHandlers');
const { registerPresenceHandlers, addConnection, broadcastPresenceToUserTeams } = require('./presenceHandlers');
const Team = require('../models/Team');
const User = require('../models/User');
const logger = require('../config/logger');
const env = require('../config/env');

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    maxHttpBufferSize: 1e7, // 10MB, for base64 previews if ever used
  });

  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    logger.info(`[socket] connected: ${socket.user.name} (${socket.id})`);

    // Personal room for direct notifications
    socket.join(`user:${userId}`);

    // Join all team rooms this user belongs to
    const teams = await Team.find({ 'members.user': userId }).select('_id');
    teams.forEach((team) => socket.join(`team:${team._id}`));

    const isFirstConnection = addConnection(userId, socket.id);
    if (isFirstConnection) {
      await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() });
      await broadcastPresenceToUserTeams(io, userId, 'online');
    }

    registerPresenceHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on('error', (err) => {
      logger.error(`[socket] error for ${socket.user.name}: ${err.message}`);
    });
  });

  return io;
}

module.exports = initSocket;
