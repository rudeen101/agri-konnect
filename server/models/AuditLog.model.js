import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'create', 'update', 'delete', 'login', 'logout',
            'password_change', 'permission_change', 'system', 
            'authenticate'
        ]
    },
    entity: {
        type: String,
        required: true,
        enum: ['User', 'Product', 'Order', 'Category', 'System']
    },
    entityId: mongoose.Schema.Types.ObjectId,
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metadata: {
        oldData: mongoose.Schema.Types.Mixed,
        newData: mongoose.Schema.Types.Mixed,
        changes: mongoose.Schema.Types.Mixed,
        ipAddress: String,
        userAgent: String,
        location: {
            country: String,
            region: String,
            city: String
        },
        additionalInfo: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    strict: false, // Allow dynamic fields in metadata
    capped: { size: 1024 * 1024 * 100, max: 100000 } // 100MB capped collection
});

// Indexes for common query patterns
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

// Static method to log an action
auditLogSchema.statics.log = function(data) {
    return this.create({
        ...data,
        timestamp: new Date()
    });
};

// Static method to get logs for an entity
auditLogSchema.statics.getEntityLogs = function(entity, entityId, limit = 50) {
    return this.find({ entity, entityId })
        .sort('-timestamp')
        .limit(limit)
        .populate('performedBy', 'name email role');
};

// Static method to purge old logs
auditLogSchema.statics.purge = async function(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.deleteMany({ timestamp: { $lt: cutoffDate } });
};

export default mongoose.model('AuditLog', auditLogSchema);