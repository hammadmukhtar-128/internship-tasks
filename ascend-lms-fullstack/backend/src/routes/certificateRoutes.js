const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Course completion certificates
 */

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Get all certificates (Instructor/Admin)
 *     tags: [Certificates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of certificates }
 *   post:
 *     summary: Generate a certificate for a student who completed a course
 *     tags: [Certificates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Certificate generated }
 */
router.get('/', authenticate, authorize('instructor', 'admin'), certificateController.getAllCertificates);
router.post('/', authenticate, authorize('instructor', 'admin'), certificateController.generateCertificate);

/**
 * @swagger
 * /certificates/my-certificates:
 *   get:
 *     summary: Get logged-in student's certificates
 *     tags: [Certificates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of certificates }
 */
router.get('/my-certificates', authenticate, authorize('student'), certificateController.getMyCertificates);

/**
 * @swagger
 * /certificates/{certificateId}:
 *   get:
 *     summary: Get/download certificate data by certificate ID
 *     tags: [Certificates]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Certificate data }
 */
router.get('/:certificateId', authenticate, certificateController.getCertificateByCertId);

module.exports = router;
