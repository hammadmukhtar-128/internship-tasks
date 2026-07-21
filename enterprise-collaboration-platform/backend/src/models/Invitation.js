const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

const invitationSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
  { timestamps: true }
);

invitationSchema.index({ team: 1, email: 1 }, { unique: true });
invitationSchema.index({ status: 1 });

invitationSchema.statics.generateToken = function generateToken() {
  return crypto.randomBytes(24).toString('hex');
};

module.exports = mongoose.model('Invitation', invitationSchema);
