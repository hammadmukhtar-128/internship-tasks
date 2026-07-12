const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completionDate: { type: Date, default: Date.now },
    certificateId: { type: String, unique: true }
  },
  { timestamps: true }
);

certificateSchema.pre('validate', function (next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  }
  next();
});

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
