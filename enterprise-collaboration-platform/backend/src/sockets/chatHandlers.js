const Message = require('../models/Message');
const Channel = require('../models/Channel');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const logger = require('../config/logger');
const { cache } = require('../config/redis');

const MENTION_REGEX = /@([a-zA-Z0-9._-]+)/g;

async function resolveMentions(content, teamId) {
  const handles = [...content.matchAll(MENTION_REGEX)].map((m) => m[1]);
  if (handles.length === 0) return [];

  const users = await User.find({
    $or: handles.map((h) => ({ name: new RegExp(`^${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') })),
  }).select('_id name');

  return users.map((u) => u._id);
}

function registerChatHandlers(io, socket) {
  const userId = socket.user._id.toString();

  // Join a channel room to receive its real-time events
  socket.on('channel:join', async ({ channelId }) => {
    try {
      const channel = await Channel.findById(channelId);
      if (!channel) return;

      const isMember = channel.members.some((m) => m.toString() === userId) || socket.user.role === 'admin';
      if (channel.type === 'private' && !isMember) {
        return socket.emit('error', { message: 'Access denied to private channel' });
      }

      socket.join(`channel:${channelId}`);
      socket.join(`team:${channel.team}`);
    } catch (err) {
      logger.error(`[socket] channel:join failed: ${err.message}`);
    }
  });

  socket.on('channel:leave', ({ channelId }) => {
    socket.leave(`channel:${channelId}`);
  });

  // Typing indicator
  socket.on('typing:start', ({ channelId }) => {
    socket.to(`channel:${channelId}`).emit('typing:update', {
      channelId,
      userId,
      userName: socket.user.name,
      isTyping: true,
    });
  });

  socket.on('typing:stop', ({ channelId }) => {
    socket.to(`channel:${channelId}`).emit('typing:update', {
      channelId,
      userId,
      userName: socket.user.name,
      isTyping: false,
    });
  });

  // Send a message
  socket.on('message:send', async (payload, callback) => {
    try {
      const { channelId, content = '', attachments = [], replyTo = null } = payload;

      const channel = await Channel.findById(channelId);
      if (!channel) return callback?.({ success: false, message: 'Channel not found' });

      const isMember = channel.members.some((m) => m.toString() === userId) || socket.user.role === 'admin';
      if (channel.type === 'private' && !isMember) {
        return callback?.({ success: false, message: 'Access denied' });
      }

      if (!content.trim() && attachments.length === 0) {
        return callback?.({ success: false, message: 'Message cannot be empty' });
      }

      const mentions = await resolveMentions(content, channel.team);

      const message = await Message.create({
        channel: channelId,
        team: channel.team,
        sender: userId,
        content,
        attachments,
        mentions,
        replyTo,
        readBy: [{ user: userId, readAt: new Date() }],
      });

      channel.lastMessageAt = new Date();
      await channel.save();

      const populated = await message.populate([
        { path: 'sender', select: 'name avatar status' },
        { path: 'mentions', select: 'name' },
        { path: 'replyTo', populate: { path: 'sender', select: 'name' } },
      ]);

      io.to(`channel:${channelId}`).emit('message:new', populated);

      // Notify mentioned users (excluding the sender)
      const mentionTargets = mentions.filter((id) => id.toString() !== userId);
      if (mentionTargets.length) {
        const notifications = await Notification.insertMany(
          mentionTargets.map((recipient) => ({
            recipient,
            sender: userId,
            type: 'mention',
            title: `${socket.user.name} mentioned you`,
            body: content.slice(0, 140),
            team: channel.team,
            channel: channelId,
            message: message._id,
          }))
        );
        notifications.forEach((n) => {
          io.to(`user:${n.recipient}`).emit('notification:new', n);
        });
      }

      // Notify other channel members of a new message (lightweight, non-mention)
      const otherMembers = channel.members.filter((m) => m.toString() !== userId);
      if (otherMembers.length) {
        io.to(`channel:${channelId}`).emit('channel:activity', {
          channelId,
          lastMessageAt: channel.lastMessageAt,
        });
      }

      await ActivityLog.create({
        user: userId,
        action: 'message_sent',
        entityType: 'Message',
        entityId: message._id,
        team: channel.team,
        description: `Sent a message in #${channel.name}`,
      });

      await cache.del(`dashboard:overview:*`);

      callback?.({ success: true, message: populated });
    } catch (err) {
      logger.error(`[socket] message:send failed: ${err.message}`);
      callback?.({ success: false, message: 'Failed to send message' });
    }
  });

  // Read receipts
  socket.on('message:read', async ({ channelId, messageId }) => {
    try {
      if (messageId) {
        const message = await Message.findById(messageId);
        if (message && !message.readBy.some((r) => r.user.toString() === userId)) {
          message.readBy.push({ user: userId, readAt: new Date() });
          await message.save();
        }
      }
      io.to(`channel:${channelId}`).emit('message:read-receipt', { channelId, messageId, userId, readAt: new Date() });
    } catch (err) {
      logger.error(`[socket] message:read failed: ${err.message}`);
    }
  });

  // Reactions (real-time echo; persistence handled via REST toggleReaction too)
  socket.on('message:react', async ({ messageId, emoji }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      let reaction = message.reactions.find((r) => r.emoji === emoji);
      if (!reaction) {
        message.reactions.push({ emoji, users: [userId] });
      } else {
        const idx = reaction.users.findIndex((u) => u.toString() === userId);
        if (idx >= 0) reaction.users.splice(idx, 1);
        else reaction.users.push(userId);
        if (reaction.users.length === 0) {
          message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
        }
      }
      await message.save();

      io.to(`channel:${message.channel}`).emit('message:reaction-update', {
        messageId,
        reactions: message.reactions,
      });
    } catch (err) {
      logger.error(`[socket] message:react failed: ${err.message}`);
    }
  });
}

module.exports = { registerChatHandlers };
