import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { MONGO_URI, MONGO_OPTIONS } from './environment.js';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            ...MONGO_OPTIONS,
            autoIndex: process.env.NODE_ENV !== 'production',
            maxPoolSize: 50,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            writeConcern: {
                w: 'majority',
                j: true,
                wtimeout: 5000
            }
        });

        logger.info('MongoDB connected successfully');

        mongoose.connection.on('connected', () => {
            logger.info('Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`Mongoose connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('Mongoose disconnected from DB');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('Mongoose connection closed through app termination');
            process.exit(0);
        });

    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;