import { celebrate, Joi, Segments } from 'celebrate';
import ErrorResponse from '../utils/errorResponse.js';
import validator from 'validator';

// Joi validation schemas
export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
});

export const validateUserCreate = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('user', 'editor', 'admin'),
    password: Joi.string().min(8)
  })
});

// Custom sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize all string fields in body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = validator.escape(req.body[key]);
        req.body[key] = validator.trim(req.body[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = validator.escape(req.query[key]);
      }
    });
  }

  next();
};

// File upload validation
export const validateFileUpload = (allowedTypes, maxSizeMB) => {
  return (req, res, next) => {
    if (!req.files || !req.files.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;
    const fileType = file.mimetype.split('/')[1];
    const fileSizeMB = file.size / (1024 * 1024);

    if (!allowedTypes.includes(fileType)) {
      return next(
        new ErrorResponse(
          `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
          400
        )
      );
    }

    if (fileSizeMB > maxSizeMB) {
      return next(
        new ErrorResponse(
          `File too large. Maximum size is ${maxSizeMB}MB`,
          400
        )
      );
    }

    next();
  };
};