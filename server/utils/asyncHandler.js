/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express error middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        // Special handling for Mongoose errors
        if (err.name === 'CastError') {
            err = ErrorResponse.badRequest('Invalid resource ID');
        } else if (err.name === 'ValidationError') {
            err = ErrorResponse.validationError(err.errors);
        } else if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            err = ErrorResponse.conflict(`Duplicate field value: ${field}`);
        }

        // Add request context to error
        err.request = {
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            query: req.query,
            user: req.user?._id
        };

        next(err);
    });
};

// Higher-order function for transaction support
const withTransaction = (fn) => async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        req.session = session;
        await fn(req, res, next);
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
};

// Timeout wrapper
const withTimeout = (fn, timeout = 5000) => async (req, res, next) => {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new ErrorResponse('Request timeout', 503));
        }, timeout);
    });

    try {
        await Promise.race([fn(req, res, next), timeoutPromise]);
    } catch (err) {
        next(err);
    }
};

export {
    asyncHandler as default,
    withTransaction,
    withTimeout
};