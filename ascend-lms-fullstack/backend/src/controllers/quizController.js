const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const ApiFeatures = require('../utils/apiFeatures');

const getAllQuizzes = catchAsync(async (req, res) => {
  const baseQuery = Quiz.find().populate('course', 'title').populate('createdBy', 'fullName');

  const total = await new ApiFeatures(Quiz.find(), req.query).filter().search(['title']).query.clone().countDocuments();
  const features = new ApiFeatures(baseQuery, req.query).filter().search(['title']).sort().limitFields().paginate();
  const quizzes = await features.query;

  res.status(200).json(
    new ApiResponse(200, 'Quizzes fetched successfully', quizzes, {
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      totalPages: Math.ceil(total / features.pagination.limit)
    })
  );
});

// @desc Get quiz by id. Students get questions without correct answers.
const getQuizById = catchAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('course', 'title').populate('createdBy', 'fullName');
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  if (req.user.role === 'student') {
    const sanitized = quiz.toObject();
    sanitized.questions = sanitized.questions.map(({ correctAnswer, ...rest }) => rest);
    return res.status(200).json(new ApiResponse(200, 'Quiz fetched successfully', { quiz: sanitized }));
  }

  res.status(200).json(new ApiResponse(200, 'Quiz fetched successfully', { quiz }));
});

const createQuiz = catchAsync(async (req, res) => {
  const course = await Course.findById(req.body.course);
  if (!course) throw new ApiError(404, 'Course not found');
  if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only add quizzes to your own courses');
  }

  const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });

  if (quiz.status === 'published' && course.studentsEnrolled.length) {
    await Notification.insertMany(
      course.studentsEnrolled.map((studentId) => ({
        recipient: studentId,
        type: 'quiz_published',
        title: 'New Quiz Published',
        message: `A new quiz "${quiz.title}" was published in "${course.title}".`,
        relatedId: quiz._id
      }))
    );
  }

  res.status(201).json(new ApiResponse(201, 'Quiz created successfully', { quiz }));
});

const updateQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update your own quizzes');
  }

  const allowedFields = ['title', 'questions', 'duration', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) quiz[field] = req.body[field];
  });
  await quiz.save();

  res.status(200).json(new ApiResponse(200, 'Quiz updated successfully', { quiz }));
});

const deleteQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own quizzes');
  }
  await quiz.deleteOne();
  await QuizResult.deleteMany({ quiz: quiz._id });
  res.status(200).json(new ApiResponse(200, 'Quiz deleted successfully'));
});

// @desc Student attempts/submits a quiz - score calculated automatically
const attemptQuiz = catchAsync(async (req, res) => {
  const { answers } = req.body; // [{ question, selectedAnswer }]
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  const existing = await QuizResult.findOne({ quiz: quiz._id, student: req.user._id });
  if (existing) throw new ApiError(409, 'You have already attempted this quiz');

  let score = 0;
  let totalPoints = 0;

  const gradedAnswers = quiz.questions.map((q) => {
    totalPoints += q.points;
    const submitted = answers.find((a) => a.question === q._id.toString());
    const isCorrect = submitted ? submitted.selectedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : false;
    if (isCorrect) score += q.points;
    return {
      question: q._id,
      selectedAnswer: submitted ? submitted.selectedAnswer : '',
      isCorrect
    };
  });

  const result = await QuizResult.create({
    quiz: quiz._id,
    student: req.user._id,
    answers: gradedAnswers,
    score,
    totalPoints
  });

  res.status(201).json(new ApiResponse(201, 'Quiz submitted successfully', { result }));
});

// @desc Get results for a quiz (instructor/admin)
const getQuizResults = catchAsync(async (req, res) => {
  const results = await QuizResult.find({ quiz: req.params.id }).populate('student', 'fullName email');
  res.status(200).json(new ApiResponse(200, 'Results fetched successfully', results));
});

// @desc Get logged-in student's own quiz results
const getMyResults = catchAsync(async (req, res) => {
  const results = await QuizResult.find({ student: req.user._id }).populate('quiz', 'title');
  res.status(200).json(new ApiResponse(200, 'Results fetched successfully', results));
});

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
  getQuizResults,
  getMyResults
};
