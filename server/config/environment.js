import Joi from 'joi';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`
);
dotenv.config({ path: envPath });


// Define environment schema
const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),

    PORT: Joi.number().default(3000),

    MONGO_URI: Joi.string()
        .uri()
        .when('NODE_ENV', {
            is: 'test',
            then: Joi.string().default('mongodb://localhost:27017/testdb'),
            otherwise: Joi.required()
        }),

    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRE: Joi.string().default('30d'),
    JWT_COOKIE_EXPIRE: Joi.number().default(30),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),

    CLOUDINARY_NAME: Joi.string().required(),
    CLOUDINARY_KEY: Joi.string().required(),
    CLOUDINARY_SECRET: Joi.string().required(),

    REDIS_URL: Joi.string().uri(),

    FRONTEND_URL: Joi.string().uri().required(),

    RATE_LIMIT_WINDOW: Joi.number().default(15),
    RATE_LIMIT_MAX: Joi.number().default(100),

    MAINTENANCE_MODE: Joi.string().default('false'),
    ENABLE_ANALYTICS: Joi.string().default('false')
}).unknown(true);

// Validate environment
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    console.error(`Environment validation error: ${error.message}`);
    process.exit(1);
}

// Export validated config
export const NODE_ENV = envVars.NODE_ENV;
export const PORT = envVars.PORT;

export const MONGO_URI = envVars.MONGO_URI;
export const MONGO_OPTIONS = {
    autoCreate: true,
    autoIndex: envVars.NODE_ENV === 'development'
};

export const JWT_SECRET = envVars.JWT_SECRET;
export const JWT_EXPIRE = envVars.JWT_EXPIRE;
export const JWT_COOKIE_EXPIRE = envVars.JWT_COOKIE_EXPIRE;

export const SMTP_CONFIG = {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    auth: {
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASS
    },
    secure: envVars.NODE_ENV === 'production'
};

export const CLOUDINARY_NAME = envVars.CLOUDINARY_NAME;
export const CLOUDINARY_KEY = envVars.CLOUDINARY_KEY;
export const CLOUDINARY_SECRET = envVars.CLOUDINARY_SECRET;
export const CLOUDINARY_FOLDER = envVars.NODE_ENV === 'production' ? 'prod' : 'dev';

export const GOOGLE_CLIENT_ID = envVars.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = envVars.GOOGLE_CLIENT_SECRET;

export const RATE_LIMIT_CONFIG = {
    windowMs: envVars.RATE_LIMIT_WINDOW * 60 * 1000,
    max: envVars.RATE_LIMIT_MAX
};

export const FRONTEND_URL = envVars.FRONTEND_URL;

// Feature flags
export const FEATURE_FLAGS = {
    MAINTENANCE_MODE: envVars.MAINTENANCE_MODE === 'true',
    ENABLE_ANALYTICS: envVars.ENABLE_ANALYTICS === 'true'
};