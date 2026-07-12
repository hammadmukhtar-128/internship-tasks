const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const emailService = require('../services/emailService');

// @desc Generate a certificate for a student who completed a course (instructor/admin)
const generateCertificate = catchAsync(async (req, res) => {
  const { student, course: courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');

  if (!course.studentsEnrolled.some((id) => id.toString() === student)) {
    throw new ApiError(400, 'Student is not enrolled in this course');
  }

  const existing = await Certificate.findOne({ student, course: courseId });
  if (existing) throw new ApiError(409, 'Certificate already generated for this student and course');

  const certificate = await Certificate.create({ student, course: courseId });
  const populated = await certificate.populate([
    { path: 'student', select: 'fullName email' },
    { path: 'course', select: 'title' }
  ]);

  await Notification.create({
    recipient: student,
    type: 'certificate_generated',
    title: 'Certificate Generated',
    message: `Your certificate for "${course.title}" is ready.`,
    relatedId: certificate._id
  });

  emailService.sendCertificateGeneratedEmail(populated.student.email, course.title, certificate.certificateId);

  res.status(201).json(new ApiResponse(201, 'Certificate generated successfully', { certificate: populated }));
});

// @desc Get logged-in student's certificates
const getMyCertificates = catchAsync(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id }).populate('course', 'title category');
  res.status(200).json(new ApiResponse(200, 'Certificates fetched successfully', certificates));
});

// @desc Get all certificates (admin/instructor)
const getAllCertificates = catchAsync(async (req, res) => {
  const certificates = await Certificate.find()
    .populate('student', 'fullName email')
    .populate('course', 'title');
  res.status(200).json(new ApiResponse(200, 'Certificates fetched successfully', certificates));
});

// @desc Download / view certificate data by certificate ID
const getCertificateByCertId = catchAsync(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
    .populate('student', 'fullName email')
    .populate('course', 'title category');
  if (!certificate) throw new ApiError(404, 'Certificate not found');
  res.status(200).json(new ApiResponse(200, 'Certificate fetched successfully', { certificate }));
});

module.exports = { generateCertificate, getMyCertificates, getAllCertificates, getCertificateByCertId };
