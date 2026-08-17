const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    goal: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Planning', 'Active', 'Completed'], default: 'Planning' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sprint', SprintSchema);
