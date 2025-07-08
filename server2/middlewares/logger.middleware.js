import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const requestId = uuidv4();
    req.requestId = requestId;

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        logger.info({
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            userId: req.user?._id,
            params: req.params,
            query: req.query
        });

        // Log slow requests
        if (duration > 1000) {
            logger.warn(`Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`);
        }
    });

    next();
};

// Audit logging middleware
export const auditLogger = (action, entity) => {
    return async (req, res, next) => {
        try {
            if (req.user) {
                await AuditLog.create({
                    action,
                    entity,
                    entityId: req.params.id,
                    performedBy: req.user._id,
                    metadata: {
                        method: req.method,
                        path: req.path,
                        body: action === 'login' ? {} : req.body, // Don't log passwords
                        statusCode: res.statusCode
                    }
                });
            }
            next();
        } catch (err) {
            // Don't block request if audit logging fails
            logger.error('Audit log failed', { error: err.message });
            next();
        }
    };
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
    logger.error({
        requestId: req.requestId,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        status: err.statusCode || 500,
        user: req.user?._id
    });

    next(err);
};