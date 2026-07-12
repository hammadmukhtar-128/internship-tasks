const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    file: { type: String, required: true },
    submittedDate: { type: Date, default: Date.now },
    marks: { type: Number, default: null, min: 0, max: 100 },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' }
  },
  { timestamps: true }
);

submissionSchema.index({ student: 1, assignment: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
