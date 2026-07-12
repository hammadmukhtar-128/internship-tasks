const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ['multiple_choice', 'true_false'], required: true },
  options: [{ type: String }], // for multiple_choice
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [questionSchema],
    duration: { type: Number, default: 30 }, // minutes
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
