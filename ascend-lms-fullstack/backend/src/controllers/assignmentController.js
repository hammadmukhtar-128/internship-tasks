const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const ApiFeatures = require('../utils/apiFeatures');
const emailService = require('../services/emailService');

// @desc Get all assignments - filter by course, search, paginate
const getAllAssignments = catchAsync(async (req, res) => {
  const baseQuery = Assignment.find().populate('course', 'title').populate('createdBy', 'fullName');

  const total = await new ApiFeatures(Assignment.find(), req.query).filter().search(['title', 'description']).query.clone().countDocuments();

  const features = new ApiFeatures(baseQuery, req.query).filter().search(['title', 'description']).sort().limitFields().paginate();
  const assignments = await features.query;

  res.status(200).json(
    new ApiResponse(200, 'Assignments fetched successfully', assignments, {
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      totalPages: Math.ceil(total / features.pagination.limit)
    })
  );
});

const getAssignmentById = catchAsync(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('course', 'title').populate('createdBy', 'fullName');
  if (!assignment) throw new ApiError(404, 'Assignment not found');
  res.status(200).json(new ApiResponse(200, 'Assignment fetched successfully', { assignment }));
});

// @desc Create assignment (instructor only, for own course)
const createAssignment = catchAsync(async (req, res) => {
  const course = await Course.findById(req.body.course);
  if (!course) throw new ApiError(404, 'Course not found');
  if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only add assignments to your own courses');
  }

  const assignment = await Assignment.create({
    ...req.body,
    createdBy: req.user._id,
    attachment: req.file ? `/uploads/assignments/${req.file.filename}` : ''
  });

  if (course.studentsEnrolled.length) {
    await Notification.insertMany(
      course.studentsEnrolled.map((studentId) => ({
        recipient: studentId,
        type: 'assignment_added',
        title: 'New Assignment',
        message: `A new assignment "${assignment.title}" was added to "${course.title}".`,
        relatedId: assignment._id
      }))
    );
  }

  res.status(201).json(new ApiResponse(201, 'Assignment created successfully', { assignment }));
});

const updateAssignment = catchAsync(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('course');
  if (!assignment) throw new ApiError(404, 'Assignment not found');

  if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update your own assignments');
  }

  const allowedFields = ['title', 'description', 'dueDate'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) assignment[field] = req.body[field];
  });
  if (req.file) assignment.attachment = `/uploads/assignments/${req.file.filename}`;

  await assignment.save();
  res.status(200).json(new ApiResponse(200, 'Assignment updated successfully', { assignment }));
});

const deleteAssignment = catchAsync(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) throw new ApiError(404, 'Assignment not found');

  if (req.user.role === 'instructor' && assignment.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own assignments');
  }

  await assignment.deleteOne();
  await Submission.deleteMany({ assignment: assignment._id });
  res.status(200).json(new ApiResponse(200, 'Assignment deleted successfully'));
});

// @desc Student submits an assignment file
const submitAssignment = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A file is required for submission');

  const assignment = await Assignment.findById(req.params.id).populate('createdBy', 'email fullName');
  if (!assignment) throw new ApiError(404, 'Assignment not found');

  const isLate = new Date() > new Date(assignment.dueDate);

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignment._id, student: req.user._id },
    {
      file: `/uploads/assignments/${req.file.filename}`,
      submittedDate: new Date(),
      status: isLate ? 'late' : 'submitted'
    },
    { new: true, upsert: true, runValidators: true }
  );

  if (assignment.createdBy?.email) {
    emailService.sendAssignmentSubmittedEmail(assignment.createdBy.email, req.user.fullName, assignment.title);
  }

  res.status(201).json(new ApiResponse(201, 'Assignment submitted successfully', { submission }));
});

// @desc Get all submissions for an assignment (instructor/admin)
const getSubmissions = catchAsync(async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'fullName email');
  res.status(200).json(new ApiResponse(200, 'Submissions fetched successfully', submissions));
});

// @desc Get logged-in student's own submissions
const getMySubmissions = catchAsync(async (req, res) => {
  const submissions = await Submission.find({ student: req.user._id }).populate('assignment', 'title dueDate');
  res.status(200).json(new ApiResponse(200, 'Submissions fetched successfully', submissions));
});

// @desc Grade a submission (instructor/admin)
const gradeSubmission = catchAsync(async (req, res) => {
  const { marks, feedback } = req.body;
  const submission = await Submission.findByIdAndUpdate(
    req.params.submissionId,
    { marks, feedback, status: 'graded' },
    { new: true, runValidators: true }
  );
  if (!submission) throw new ApiError(404, 'Submission not found');

  res.status(200).json(new ApiResponse(200, 'Submission graded successfully', { submission }));
});

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  getMySubmissions,
  gradeSubmission
};
