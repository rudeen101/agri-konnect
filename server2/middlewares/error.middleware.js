import ErrorResponse from '../utils/errorResponse.js';
import logger from '../utils/logger.js';
import { isCelebrateError } from 'celebrate';

// Global error handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack.red);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value entered for ${field}`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(messages, 400);
    }

    // Celebrate validation error (Joi)
    if (isCelebrateError(err)) {
        const details = [];
        for (const [segment, joiError] of err.details.entries()) {
            details.push({
                segment,
                message: joiError.details.map(d => d.message)
            });
        }
        error = new ErrorResponse('Validation failed', 422, details);
    }

    // Custom error types
    if (err.name === 'TokenExpiredError') {
        error = new ErrorResponse('Authentication token expired', 401);
    }

    if (err.name === 'JsonWebTokenError') {
        error = new ErrorResponse('Invalid authentication token', 401);
    }

    // Log error to file/system
    logger.error({
        message: error.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        status: error.statusCode || 500,
        user: req.user?._id
    });

    // Send error response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        details: error.details || undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

// 404 Not Found handler
export const notFound = (req, res, next) => {
    next(new ErrorResponse(`Not Found - ${req.originalUrl}`, 404));
};