import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Notification must belong to a user'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Notification must have a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Notification must have a message'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    type: {
        type: String,
        required: true,
        enum: [
            'order', 'payment', 'shipping',
            'promotion', 'system', 'account'
        ],
        index: true
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedEntityModel'
    },
    relatedEntityModel: {
        type: String,
        enum: ['Order', 'Product', 'User', 'Review']
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    action: {
        url: String,
        label: String,
        method: String // GET, POST, etc.
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    expiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 }
    },
    metadata: mongoose.Schema.Types.Mixed
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for common query patterns
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });

// Static method to create a notification
notificationSchema.statics.createNotification = async function(data) {
    const notification = new this(data);
    await notification.save();

    // Real-time update via WebSocket would happen here
    // io.to(`user_${data.user}`).emit('new_notification', notification);

    return notification;
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds = []) {
    const query = { user: userId };
    if (notificationIds.length > 0) {
        query._id = { $in: notificationIds };
    }

    return this.updateMany(
        query,
        { $set: { isRead: true } },
        { multi: true }
    );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
    return this.countDocuments({ user: userId, isRead: false });
};

// Static method to purge old notifications
notificationSchema.statics.purgeOldNotifications = async function(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.deleteMany({
        createdAt: { $lt: cutoffDate },
        priority: { $ne: 'critical' }
    });
};

// Pre-save hook to set default expiration
notificationSchema.pre('save', function(next) {
    if (!this.expiresAt) {
        // Default expiration based on priority
        const expiresInDays = {
            critical: 30,
            high: 14,
            medium: 7,
            low: 3
        };

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays[this.priority]);
        this.expiresAt = expiryDate;
    }
    next();
});

export default mongoose.model('Notification', notificationSchema);