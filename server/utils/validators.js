import { body, param, query } from 'express-validator';
import validator from 'validator';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';

// Common validation chains
const emailValidator = body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail();

const passwordValidator = body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number');

// Custom validators
const isMongoId = (value) => {
    if (!validator.isMongoId(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
};

const isUniqueEmail = async (value) => {
    const user = await User.findOne({ email: value });
    if (user) {
        throw new Error('Email already in use');
    }
    return true;
};

const isValidProductId = async (value) => {
    const product = await Product.findById(value);
    if (!product) {
        throw new Error('Product not found');
    }
    return true;
};

// Validation middleware builders
export const validateUserRegistration = () => [
    emailValidator.custom(isUniqueEmail),
    passwordValidator,
    body('name').trim().notEmpty().withMessage('Name is required')
];

export const validateLogin = () => [
    emailValidator,
    body('password').trim().notEmpty().withMessage('Password is required')
];

export const validateObjectIdParam = (paramName) => [
    param(paramName).custom(isMongoId)
];

export const validateProductCreate = () => [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('variants.*.name').trim().notEmpty().withMessage('Variant name is required'),
    body('variants.*.sku').trim().notEmpty().withMessage('SKU is required')
];

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
    // Sanitize all string fields in body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = validator.escape(validator.trim(req.body[key]));
            }
        });
    }

    // Sanitize query parameters
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = validator.escape(validator.trim(req.query[key]));
            }
        });
    }

    next();
};

// File validation
export const validateFileUpload = (allowedTypes, maxSizeMB) => (req, res, next) => {
    if (!req.file) {
        return next(new Error('Please upload a file'));
    }

    const fileType = req.file.mimetype.split('/')[1];
    const fileSizeMB = req.file.size / (1024 * 1024);

    if (!allowedTypes.includes(fileType)) {
        return next(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
    }

    if (fileSizeMB > maxSizeMB) {
        return next(new Error(`File too large. Max size: ${maxSizeMB}MB`));
    }

    next();
};