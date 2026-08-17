const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g. 'created', 'updated', 'status_changed', 'assigned', 'completed'
    entityType: { type: String, required: true }, // 'Project' | 'Task' | 'SubTask' | 'Sprint' | 'Organization'
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ organization: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
