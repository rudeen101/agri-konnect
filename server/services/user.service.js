import User from '../models/User.model.js';
import ErrorResponse from '../utils/errorResponse.js';
import { sendEmail } from './email.service.js';
import AuditLog from '../models/AuditLog.model.js';

class UserService {
    // Get paginated users with advanced filtering
    async getUsers(query) {
        const { page = 1, limit = 10, sort, ...filters } = query;

        // Build query
        let queryObj = { ...filters };
        
        // Advanced filtering
        if (queryObj.role) {
            queryObj.role = { $in: queryObj.role.split(',') };
        }

        if (queryObj.search) {
            queryObj.$or = [
                { name: { $regex: queryObj.search, $options: 'i' } },
                { email: { $regex: queryObj.search, $options: 'i' } }
            ];
            delete queryObj.search;
        }

        // Execute query
        const users = await User.find(queryObj)
            .sort(sort || '-createdAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-password -refreshToken');

        const total = await User.countDocuments(queryObj);

        return {
            users,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        };
    }

    // Create user with invitation
    async createUser(userData, currentUser) {
        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const user = await User.create({
            ...userData,
            password: hashedPassword,
            createdBy: currentUser._id
        });

        // Send invitation email
        await sendEmail({
            email: user.email,
            subject: 'Your Account Has Been Created',
            template: 'user-invite',
            context: {
                name: user.name,
                tempPassword,
                loginUrl: process.env.FRONTEND_URL,
                adminName: currentUser.name
            }
        });

        // Audit log
        await AuditLog.create({
            action: 'user_create',
            entity: 'User',
            entityId: user._id,
            performedBy: currentUser._id,
            metadata: {
                role: user.role
            }
        });

        return user;
    }

    // Update user with change tracking
    async updateUser(id, updateData, currentUser) {
        const user = await User.findById(id);
        if (!user) {
            throw new ErrorResponse('User not found', 404);
        }

        // Track changes
        const changes = {};
        Object.keys(updateData).forEach(key => {
            if (user[key] !== updateData[key]) {
                changes[key] = {
                    old: user[key],
                    new: updateData[key]
                };
            }
        });

        // Apply updates
        Object.assign(user, updateData);
        await user.save();

        // Log significant changes
        if (Object.keys(changes).length > 0) {
            await AuditLog.create({
                action: 'user_update',
                entity: 'User',
                entityId: user._id,
                performedBy: currentUser._id,
                metadata: { changes }
            });
        }

        return user;
    }

    // Deactivate user (soft delete)
    async deactivateUser(id, currentUser) {
        const user = await User.findByIdAndUpdate(
            id,
            { 
                isActive: false,
                deactivatedBy: currentUser._id,
                deactivatedAt: Date.now() 
            },
            { new: true }
        );

        await AuditLog.create({
            action: 'user_deactivate',
            entity: 'User',
            entityId: user._id,
            performedBy: currentUser._id
        });

        return user;
    }

    // Bulk user operations
    async bulkUpdateUsers(ids, updateData, currentUser) {
        const result = await User.updateMany(
            { _id: { $in: ids } },
            updateData
        );

        await AuditLog.create({
            action: 'bulk_user_update',
            entity: 'User',
            performedBy: currentUser._id,
            metadata: {
                count: ids.length,
                updates: updateData
            }
        });

        return result;
    }
}

export default new UserService();