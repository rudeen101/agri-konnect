import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res, next) => {
    // Parallel database calls
    const [
        userCount,
        productCount,
        lowStockProducts,
        recentOrders,
        revenueStats
    ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Product.countDocuments({ inventory: { $lt: 10 } }),
        Order.find().sort({ createdAt: -1 }).limit(5),
        Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' },
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    res.status(200).json({
        success: true,
        data: {
            userCount,
            productCount,
            lowStockProducts,
            recentOrders,
            revenue: revenueStats[0] || { totalRevenue: 0, averageOrderValue: 0, count: 0 }
        }
    });
});

// @desc    Get time-based analytics
// @route   GET /api/v1/dashboard/analytics/:timeframe
// @access  Private/Admin
export const getTimeBasedAnalytics = asyncHandler(async (req, res, next) => {
    const { timeframe } = req.params;
    let groupBy, dateFormat;

    switch (timeframe) {
        case 'daily':
            groupBy = { $hour: '$createdAt' };
            dateFormat = '%H:00';
            break;
        case 'weekly':
            groupBy = { $dayOfWeek: '$createdAt' };
            dateFormat = '%u';
            break;
        case 'monthly':
            groupBy = { $dayOfMonth: '$createdAt' };
            dateFormat = '%d';
            break;
        default:
            groupBy = { $month: '$createdAt' };
            dateFormat = '%m';
    }

    const analytics = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: getDateRange(timeframe) }
            }
        },
        {
            $group: {
                _id: groupBy,
                count: { $sum: 1 },
                total: { $sum: '$total' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        success: true,
        data: analytics
    });
});