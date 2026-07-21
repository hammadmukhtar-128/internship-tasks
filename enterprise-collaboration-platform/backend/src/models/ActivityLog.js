const mongoose = require('mongoose');
const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: {
      type: String,
      enum: [
        'user_login',
        'user_register',
        'user_logout',
        'password_reset',
        'team_created',
        'team_updated',
        'team_deleted',
        'member_added',
        'member_removed',
        'channel_created',
        'channel_updated',
        'channel_deleted',
        'message_sent',
        'message_deleted',
        'message_edited',
        'role_changed',
        'file_uploaded',
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['User', 'Team', 'Channel', 'Message', 'Invitation'],
    },
    entityId: { type: Schema.Types.ObjectId },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    description: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ team: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
