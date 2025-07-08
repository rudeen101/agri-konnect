import logger from './utils/logger.js';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  logger.error('Uncaught Exception:', err);
  // Optionally: log to a file or external service here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
logger.error('Unhandled Rejection:', reason);

  // Optionally: log to a file or external service here
});

// import express from 'express';
// const app = express();

import connectDB from "./config/database.js";
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();


// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});