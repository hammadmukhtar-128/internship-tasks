const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'mention',
        'message',
        'channel_invite',
        'team_invite',
        'team_join',
        'channel_created',
        'channel_updated',
        'removed_from_team',
        'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
    message: { type: Schema.Types.ObjectId, ref: 'Message' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
