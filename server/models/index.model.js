import mongoose from 'mongoose';
import User from './User.model.js';
import Product from './Product.model.js';
import Order from './Order.model.js';
import AuditLog from './AuditLog.model.js';
import Category from './Category.model.js';
import Brand from './Brand.model.js';
import Review from './Review.model.js';
import Notification from './Notification.model.js';

// Register models
const models = {
    User,
    Product,
    Order,
    AuditLog,
    Category,
    Brand,
    Review,
    Notification
};

// Export models and mongoose instance
export {
    mongoose,
    models as default,
    User,
    Product,
    Order,
    AuditLog,
    Category,
    Brand,
    Review,
    Notification
};

// Helper to truncate collections (for testing)
export async function truncateCollections() {
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('This operation is only allowed in test environment');
    }

    await Promise.all(
        Object.values(models).map(model =>
            model.deleteMany({})
        )
    );
}

// Helper to sync indexes
export async function syncIndexes() {
    await Promise.all(
        Object.values(models).map(model =>
            model.syncIndexes()
        )
    );
}

// Helper to get model by name
export function getModel(name) {
    return models[name];
}