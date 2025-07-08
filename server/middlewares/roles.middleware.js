import ErrorResponse from '../utils/errorResponse.js';
import Permission from '../models/Permission.model.js';

// Basic role check
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

// Advanced permission-based access
export const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Get user with populated permissions
            const user = await User.findById(req.user.id)
                .populate({
                    path: 'role',
                    populate: {
                        path: 'permissions'
                    }
                });

            // Check if permission exists
            const hasAccess = user.role.permissions.some(
                perm => perm.code === requiredPermission
            );

            if (!hasAccess && user.role.name !== 'superadmin') {
                return next(
                    new ErrorResponse(
                        `You don't have permission to ${requiredPermission}`,
                        403
                    )
                );
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

// Resource ownership check
export const checkOwnership = (model, paramName = 'id') => {
    return async (req, res, next) => {
        const resource = await model.findById(req.params[paramName]);
        
        if (!resource) {
            return next(new ErrorResponse('Resource not found', 404));
        }

        // Check if user owns resource or is admin
        if (
            resource.user.toString() !== req.user.id &&
            req.user.role !== 'admin' &&
            req.user.role !== 'superadmin'
        ) {
            return next(
                new ErrorResponse('Not authorized to modify this resource', 403)
            );
        }

        req.resource = resource;
        next();
    };
};