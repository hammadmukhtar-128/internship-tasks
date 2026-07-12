const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId },
        selectedAnswer: String,
        isCorrect: Boolean
      }
    ],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

quizResultSchema.index({ quiz: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
