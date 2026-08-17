const mongoose = require('mongoose');
const crypto = require('crypto');

const TeamInviteSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['Admin', 'Member', 'Viewer'], default: 'Member' },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Expired'], default: 'Pending' },
    token: { type: String, default: () => crypto.randomBytes(20).toString('hex') },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeamInvite', TeamInviteSchema);
