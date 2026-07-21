const mongoose = require('mongoose');
const { Schema } = mongoose;

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true,
      maxlength: 60,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 300,
      default: '',
    },
    type: {
      type: String,
      enum: ['public', 'private', 'dm'],
      default: 'public',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isArchived: { type: Boolean, default: false },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

channelSchema.index({ team: 1, name: 1 }, { unique: true });
channelSchema.index({ members: 1 });
channelSchema.index({ team: 1, type: 1 });

module.exports = mongoose.model('Channel', channelSchema);
