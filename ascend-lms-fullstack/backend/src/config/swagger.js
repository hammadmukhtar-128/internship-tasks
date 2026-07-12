const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise LMS API',
      version: '1.0.0',
      description:
        'REST API documentation for the Enterprise Learning Management System (LMS). ' +
        'Covers Authentication, Users, Courses, Assignments, Quizzes, Notifications and Certificates.',
      contact: { name: 'LMS API Support' }
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Local server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js', './src/docs/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
