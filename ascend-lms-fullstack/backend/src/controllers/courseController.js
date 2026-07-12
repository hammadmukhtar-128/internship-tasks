const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const User = require('../models/User');
const ApiFeatures = require('../utils/apiFeatures');
const emailService = require('../services/emailService');

// @desc Get all courses - filter by category/instructor/status/price, search, paginate
const getAllCourses = catchAsync(async (req, res) => {
  const baseQuery = Course.find().populate('instructor', 'fullName email profileImage');

  const total = await new ApiFeatures(Course.find(), req.query)
    .filter()
    .search(['title', 'description', 'category'])
    .query.clone()
    .countDocuments();

  const features = new ApiFeatures(baseQuery, req.query)
    .filter()
    .search(['title', 'description', 'category'])
    .sort()
    .limitFields()
    .paginate();

  const courses = await features.query;

  res.status(200).json(
    new ApiResponse(200, 'Courses fetched successfully', courses, {
      total,
      page: features.pagination.page,
      limit: features.pagination.limit,
      totalPages: Math.ceil(total / features.pagination.limit)
    })
  );
});

// @desc Get single course
const getCourseById = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'fullName email profileImage')
    .populate('studentsEnrolled', 'fullName email');
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json(new ApiResponse(200, 'Course fetched successfully', { course }));
});

// @desc Create course (instructor/admin)
const createCourse = catchAsync(async (req, res) => {
  const instructorId = req.user.role === 'admin' && req.body.instructor ? req.body.instructor : req.user._id;

  const course = await Course.create({
    ...req.body,
    instructor: instructorId,
    thumbnail: req.file ? `/uploads/thumbnails/${req.file.filename}` : ''
  });

  // Notify all students of new course
  const students = await User.find({ role: 'student' }).select('_id');
  if (students.length) {
    await Notification.insertMany(
      students.map((s) => ({
        recipient: s._id,
        type: 'new_course',
        title: 'New Course Available',
        message: `A new course "${course.title}" has been published.`,
        relatedId: course._id
      }))
    );
  }

  res.status(201).json(new ApiResponse(201, 'Course created successfully', { course }));
});

// @desc Update course - instructor can only update own course, admin any
const updateCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');

  if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only update your own courses');
  }

  const allowedFields = ['title', 'description', 'category', 'duration', 'price', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) course[field] = req.body[field];
  });
  if (req.file) course.thumbnail = `/uploads/thumbnails/${req.file.filename}`;

  await course.save();
  res.status(200).json(new ApiResponse(200, 'Course updated successfully', { course }));
});

// @desc Delete course - instructor can only delete own course, admin any
const deleteCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');

  if (req.user.role === 'instructor' && course.instructor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own courses');
  }

  await course.deleteOne();
  res.status(200).json(new ApiResponse(200, 'Course deleted successfully'));
});

// @desc Enroll current student in a course
const enrollInCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');

  if (course.studentsEnrolled.some((id) => id.toString() === req.user._id.toString())) {
    throw new ApiError(409, 'You are already enrolled in this course');
  }

  course.studentsEnrolled.push(req.user._id);
  await course.save();

  emailService.sendCourseEnrollmentEmail(req.user.email, course.title);

  res.status(200).json(new ApiResponse(200, 'Enrolled successfully', { course }));
});

// @desc Get courses belonging to logged in instructor
const getMyCourses = catchAsync(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  res.status(200).json(new ApiResponse(200, 'Courses fetched successfully', courses));
});

// @desc Get courses the logged in student is enrolled in
const getEnrolledCourses = catchAsync(async (req, res) => {
  const courses = await Course.find({ studentsEnrolled: req.user._id }).populate('instructor', 'fullName email');
  res.status(200).json(new ApiResponse(200, 'Enrolled courses fetched successfully', courses));
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getMyCourses,
  getEnrolledCourses
};
