const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['Owner', 'Admin', 'Member', 'Viewer'], default: 'Member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, required: true, unique: true },
    members: [MemberSchema],
    taskCounter: { type: Number, default: 0 }, // for PROJ-1 style ids (per-project actually, kept here as fallback)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', OrganizationSchema);
