/**
 * Seed script - populates the local MongoDB database with sample data:
 * 1 admin, 2 instructors, 3 students, sample courses, assignments and quizzes.
 *
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Assignment = require('./src/models/Assignment');
const Quiz = require('./src/models/Quiz');
const Notification = require('./src/models/Notification');
const Certificate = require('./src/models/Certificate');
const Submission = require('./src/models/Submission');
const QuizResult = require('./src/models/QuizResult');
const logger = require('./src/utils/logger');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms_backend');
  logger.info('Connected to MongoDB for seeding...');

  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Assignment.deleteMany(),
    Quiz.deleteMany(),
    Notification.deleteMany(),
    Certificate.deleteMany(),
    Submission.deleteMany(),
    QuizResult.deleteMany()
  ]);
  logger.info('Existing data cleared.');

  const admin = await User.create({
    fullName: 'Alice Admin',
    email: 'admin@lms.com',
    password: 'Password123!',
    role: 'admin',
    bio: 'Platform administrator'
  });

  const instructor1 = await User.create({
    fullName: 'John Instructor',
    email: 'instructor@lms.com',
    password: 'Password123!',
    role: 'instructor',
    bio: 'Full-stack development instructor'
  });

  const instructor2 = await User.create({
    fullName: 'Maria Teacher',
    email: 'maria@lms.com',
    password: 'Password123!',
    role: 'instructor',
    bio: 'Data science instructor'
  });

  const student1 = await User.create({
    fullName: 'Sam Student',
    email: 'student@lms.com',
    password: 'Password123!',
    role: 'student'
  });

  const student2 = await User.create({
    fullName: 'Priya Learner',
    email: 'priya@lms.com',
    password: 'Password123!',
    role: 'student'
  });

  const student3 = await User.create({
    fullName: 'Ken Scholar',
    email: 'ken@lms.com',
    password: 'Password123!',
    role: 'student'
  });

  const course1 = await Course.create({
    title: 'Full-Stack Web Development with MERN',
    description: 'Learn to build full-stack applications using MongoDB, Express, React and Node.js.',
    instructor: instructor1._id,
    category: 'Web Development',
    duration: '8 weeks',
    price: 199,
    status: 'published',
    studentsEnrolled: [student1._id, student2._id]
  });

  const course2 = await Course.create({
    title: 'Introduction to Data Science',
    description: 'A beginner friendly introduction to data analysis, statistics and Python.',
    instructor: instructor2._id,
    category: 'Data Science',
    duration: '6 weeks',
    price: 149,
    status: 'published',
    studentsEnrolled: [student1._id, student3._id]
  });

  const course3 = await Course.create({
    title: 'Advanced Node.js & Microservices',
    description: 'Deep dive into scalable backend architecture with Node.js.',
    instructor: instructor1._id,
    category: 'Backend Development',
    duration: '5 weeks',
    price: 249,
    status: 'draft',
    studentsEnrolled: []
  });

  await Assignment.create({
    title: 'Build a REST API',
    description: 'Create a REST API with CRUD operations using Express and MongoDB.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    course: course1._id,
    createdBy: instructor1._id
  });

  await Assignment.create({
    title: 'Exploratory Data Analysis',
    description: 'Perform EDA on the provided dataset and summarize your findings.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    course: course2._id,
    createdBy: instructor2._id
  });

  await Quiz.create({
    title: 'JavaScript Fundamentals Quiz',
    course: course1._id,
    createdBy: instructor1._id,
    duration: 20,
    status: 'published',
    questions: [
      {
        questionText: 'Which keyword declares a block-scoped variable in JavaScript?',
        type: 'multiple_choice',
        options: ['var', 'let', 'function', 'global'],
        correctAnswer: 'let',
        points: 2
      },
      {
        questionText: 'JavaScript is a statically typed language.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 1
      }
    ]
  });

  await Quiz.create({
    title: 'Statistics Basics Quiz',
    course: course2._id,
    createdBy: instructor2._id,
    duration: 15,
    status: 'published',
    questions: [
      {
        questionText: 'The mean is also known as the average.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 1
      }
    ]
  });

  logger.info('Seed data created successfully!');
  logger.info('---------------------------------------');
  logger.info('Login credentials (password for all: Password123!):');
  logger.info(`Admin:      ${admin.email}`);
  logger.info(`Instructor: ${instructor1.email}`);
  logger.info(`Instructor: ${instructor2.email}`);
  logger.info(`Student:    ${student1.email}`);
  logger.info(`Student:    ${student2.email}`);
  logger.info(`Student:    ${student3.email}`);
  logger.info('---------------------------------------');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Seeding failed: ${err.message}`);
  process.exit(1);
});
