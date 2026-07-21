const swaggerJSDoc = require('swagger-jsdoc');
const env = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Collaboration Platform API',
      version: '1.0.0',
      description:
        'REST API documentation for the Enterprise Collaboration Platform (Slack/Teams-style). ' +
        'Includes Auth, Teams, Channels, Messages, Notifications, Admin and Uploads.',
    },
    servers: [{ url: `http://localhost:${env.PORT}/api/v1`, description: 'Local server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
