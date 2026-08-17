const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const AttachmentSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    path: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true }, // e.g. PROJ-1
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['To Do', 'In Progress', 'In Review', 'Done'], default: 'To Do' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    startDate: { type: Date },
    dueDate: { type: Date },
    labels: [{ type: String }],
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    storyPoints: { type: Number, default: 1 },
    order: { type: Number, default: 0 }, // ordering within a status column
    comments: [CommentSchema],
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ organization: 1 });

module.exports = mongoose.model('Task', TaskSchema);
