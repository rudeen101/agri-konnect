import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.model.js';
import AuditLog from '../models/AuditLog.model.js';

// Protect routes with JWT authentication
export const protect = async (req, res, next) => {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user with fresh data (excluding sensitive fields)
        const user = await User.findById(decoded.id)
            .select('-password -resetPasswordToken -resetPasswordExpire')
            .populate('role');

        if (!user || !user.isActive) {
            return next(new ErrorResponse('User no longer exists or is inactive', 401));
        }

        // Check if password changed after token was issued
        if (user.changedPasswordAfter(decoded.iat)) {
            return next(new ErrorResponse('Password recently changed. Please log in again.', 401));
        }

        // Attach user to request
        req.user = user;

        // Log authentication
        await AuditLog.create({
            action: 'authenticate',
            entity: 'User',
            entityId: user._id,
            performedBy: user._id,
            metadata: {
                route: req.originalUrl,
                method: req.method
            }
        });

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Session-based authentication alternative
export const sessionAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return next(new ErrorResponse('Not authenticated', 401));
};

// API key authentication
export const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return next(new ErrorResponse('Invalid API key', 401));
    }

    next();
};