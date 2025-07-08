class ErrorResponse extends Error {
    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = true;
        this.timestamp = new Date().toISOString();

        // Capture stack trace (excluding constructor call)
        Error.captureStackTrace(this, this.constructor);
    }

    // Standard error types
    static badRequest(message = 'Bad Request', details = null) {
        return new ErrorResponse(message, 400, details);
    }

    static unauthorized(message = 'Unauthorized') {
        return new ErrorResponse(message, 401);
    }

    static forbidden(message = 'Forbidden') {
        return new ErrorResponse(message, 403);
    }

    static notFound(message = 'Resource not found') {
        return new ErrorResponse(message, 404);
    }

    static conflict(message = 'Resource conflict') {
        return new ErrorResponse(message, 409);
    }

    // Database errors
    static databaseError(err) {
        return new ErrorResponse(
            'Database operation failed',
            500,
            process.env.NODE_ENV === 'development' ? err : null
        );
    }

    // Validation errors
    static validationError(errors) {
        return new ErrorResponse(
            'Validation failed',
            422,
            errors.array ? errors.array() : errors
        );
    }

    // Convert any error to ErrorResponse
    static fromError(error) {
        if (error instanceof ErrorResponse) return error;

        return new ErrorResponse(
            error.message || 'Internal Server Error',
            error.statusCode || 500,
            process.env.NODE_ENV === 'development' ? error.stack : null
        );
    }
}

// Specialized error classes
class RateLimitError extends ErrorResponse {
    constructor() {
        super('Too many requests', 429);
        this.retryAfter = 60; // Seconds
    }
}

class DatabaseConnectionError extends ErrorResponse {
    constructor() {
        super('Database connection error', 503);
        this.isRetryable = true;
    }
}

export {
    ErrorResponse as default,
    RateLimitError,
    DatabaseConnectionError
};