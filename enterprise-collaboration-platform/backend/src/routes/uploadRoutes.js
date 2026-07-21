const express = require('express');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File and image attachment uploads
 */

/**
 * @swagger
 * /uploads/single:
 *   post:
 *     summary: Upload a single file
 *     tags: [Uploads]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: File uploaded }
 */
router.post('/single', upload.single('file'), uploadController.uploadFile);
router.post('/multiple', upload.array('files', 5), uploadController.uploadMultiple);

module.exports = router;
