const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const logger = require('../config/logger');

/**
 * Authenticates a socket connection using the JWT access token passed in
 * the handshake auth payload: io(url, { auth: { token } })
 */
module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) return next(new Error('User not found or inactive'));

    socket.user = user;
    next();
  } catch (err) {
    logger.warn(`[socket] auth failed: ${err.message}`);
    next(new Error('Invalid or expired token'));
  }
};
