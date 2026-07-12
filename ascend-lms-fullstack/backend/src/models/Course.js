const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Course title is required'], trim: true },
    description: { type: String, required: [true, 'Course description is required'] },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnail: { type: String, default: '' },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    duration: { type: String, default: '' }, // e.g. "6 weeks"
    price: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', category: 'text' });

courseSchema.virtual('enrollmentCount').get(function () {
  return this.studentsEnrolled ? this.studentsEnrolled.length : 0;
});
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
