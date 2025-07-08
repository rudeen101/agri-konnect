import Setting from '../models/Setting.model.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Get application settings
// @route   GET /api/v1/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req, res, next) => {
    const settings = await Setting.findOne();

    if (!settings) {
        // Initialize default settings if none exist
        const defaultSettings = await Setting.create({
            theme: 'light',
            pagination: 10,
            emailNotifications: true
        });
        return res.status(200).json({
            success: true,
            data: defaultSettings
        });
    }

    res.status(200).json({
        success: true,
        data: settings
    });
});

// @desc    Update application settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res, next) => {
    let settings = await Setting.findOne();

    if (!settings) {
        settings = await Setting.create(req.body);
    } else {
        settings = await Setting.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true
        });
    }

    // Broadcast settings change to connected clients
    req.io.emit('settings_updated', settings);

    res.status(200).json({
        success: true,
        data: settings
    });
});

// @desc    Get system information
// @route   GET /api/v1/settings/system
// @access  Private/Admin
export const getSystemInfo = asyncHandler(async (req, res, next) => {
    const systemInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        databaseStatus: await checkDatabaseStatus(),
        lastBackup: await getLastBackupDate()
    };

    res.status(200).json({
        success: true,
        data: systemInfo
    });
});