import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions 
} from '../utils/permissions.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.model.js';
import AuditLog from '../models/AuditLog.model.js'

// Authentication check
export const authenticate = async (req, res, next) => {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    // If no token found, return unauthorized error
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // If token is present, verify it
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

// Single permission check
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ 
        success: false, 
        error: `Requires permission: ${permission}` 
      });
    }
    next();
  };
};

// Any of multiple permissions
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!hasAnyPermission(req.user, ...permissions)) {
      return res.status(403).json({ 
        success: false, 
        error: `Requires one of: ${permissions.join(', ')}` 
      });
    }
    next();
  };
};

// All of multiple permissions
export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!hasAllPermissions(req.user, ...permissions)) {
      return res.status(403).json({ 
        success: false, 
        error: `Requires all: ${permissions.join(', ')}` 
      });
    }
    next();
  };
};

// Role requirement
export const requireRole = (roles) => {
  return (req, res, next) => {
    // if (!req.user?.roles?.some(role => roles.includes(role))) {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Requires role: ${roles.join(' or ')}` 
      });
    }
    next();
  };
};

// Ownership verification middleware
export const verifyOwner = (model, path = '_id', ownerPath = 'user') => {
  return async (req, res, next) => {
    try {
      const document = await model.findById(req.params[path]);
      
      if (!document) {
        return res.status(404).json({ success: false, error: 'Not found' });
      }

      // Allow admins to bypass ownership check
      if (hasPermission(req.user, PERMISSIONS.ADMIN.MANAGE_PRODUCTS)) {
        return next();
      }

      if (document[ownerPath].toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          error: 'Not authorized to access this resource' 
        });
      }

      req.document = document;
      next();
    } catch (error) {
      next(error);
    }
  };
};