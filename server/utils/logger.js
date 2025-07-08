import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { inspect } from 'util';
import { NODE_ENV } from '../config/environment.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom formatter for development
const devFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (stack) msg += `\n${stack}`;
    if (Object.keys(meta).length) {
        msg += `\n${inspect(meta, { colors: true, depth: 3 })}`;
    }
    return msg;
});

// Production JSON formatter
const prodFormat = printf(({ level, message, timestamp, ...meta }) => {
    return JSON.stringify({
        level,
        message,
        timestamp,
        ...meta
    });
});

// Configure transports based on environment
const transports = [
    new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: prodFormat
    })
];

if (NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(colorize(), devFormat)
        })
    );
}

// Create logger instance
const logger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        NODE_ENV === 'production' ? prodFormat : devFormat
    ),
    transports,
    exceptionHandlers: [
        new DailyRotateFile({
            filename: 'logs/exceptions-%DATE%.log'
        })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: 'logs/rejections-%DATE%.log'
        })
    ]
});

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        logger.info({
            type: 'request',
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip,
            user: req.user?._id,
            params: req.params,
            query: req.query
        });
    });

    next();
};

// Audit logging
export const auditLog = (action, entity, metadata = {}) => {
    return (req, res, next) => {
        logger.info({
            type: 'audit',
            action,
            entity,
            user: req.user?._id,
            ...metadata
        });
        next();
    };
};

// Structured error logging
export const errorLogger = (err, req, res, next) => {
    logger.error({
        type: 'error',
        message: err.message,
        stack: err.stack,
        status: err.statusCode || 500,
        path: req.path,
        method: req.method,
        user: req.user?._id
    });

    next(err);
};

export default logger;