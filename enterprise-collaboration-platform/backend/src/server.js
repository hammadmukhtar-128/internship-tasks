// Use public DNS servers for reliable SRV record resolution (e.g. MongoDB Atlas)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const initSocket = require('./sockets');

process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

const server = http.createServer(app);
const io = initSocket(server);

// Make io accessible to REST controllers if needed (e.g. req.app.get('io'))
app.set('io', io);

const start = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`📚 API docs available at http://localhost:${env.PORT}/api-docs`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => logger.info('Process terminated.'));
});

module.exports = server;
