require('./setup');
require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret';

const request = require('supertest');
const app = require('../app');

describe('Course API', () => {
  let instructorToken;
  let studentToken;

  beforeEach(async () => {
    const instructorRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Instructor One',
      email: 'instructor1@example.com',
      password: 'Password123!',
      role: 'instructor'
    });
    instructorToken = instructorRes.body.data.accessToken;

    const studentRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Student One',
      email: 'student1@example.com',
      password: 'Password123!',
      role: 'student'
    });
    studentToken = studentRes.body.data.accessToken;
  });

  it('should allow an instructor to create a course', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ title: 'Test Course', description: 'A course for testing', category: 'Testing', price: 50 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.course.title).toBe('Test Course');
  });

  it('should not allow a student to create a course', async () => {
    const res = await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Test Course', description: 'A course for testing', category: 'Testing' });

    expect(res.statusCode).toBe(403);
  });

  it('should list courses publicly', async () => {
    await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ title: 'Public Course', description: 'Visible to all', category: 'General' });

    const res = await request(app).get('/api/v1/courses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should allow a student to enroll in a course', async () => {
    const courseRes = await request(app)
      .post('/api/v1/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ title: 'Enroll Course', description: 'Course to enroll in', category: 'General' });

    const courseId = courseRes.body.data.course._id;

    const res = await request(app).post(`/api/v1/courses/${courseId}/enroll`).set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.course.studentsEnrolled).toContain(expect.anything());
  });
});
