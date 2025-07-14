import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
// const Review = require('../models/Review');


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
        Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
                }
            },
            {
                $facet: {
                recentOrders: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 }
                ],
                totalCount: [
                    { $count: "count" }
                ]
                }
            }
        ]),

        Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    averageOrderValue: { $avg: '$totalPrice' },
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

// controllers/activityController.js
export const getRecentActivity = asyncHandler(async (req, res, next) => {
    try {
        // 1. Fetch recent activities from different collections
        const [
        recentUsers,
        recentOrders,
        recentStockUpdates,
        recentReviews
        ] = await Promise.all([
        User.find().sort({ createdAt: -1 }).limit(1),
        Order.find().sort({ createdAt: -1 }).limit(1),
        Product.find({ 
            inventoryUpdatedAt: { $exists: true } 
        }).sort({ inventoryUpdatedAt: -1 }).limit(1)
        // Review.find().sort({ createdAt: -1 }).limit(1)
        ]);

        // 2. Transform data into activity format
        const activities = [];
        
        // Add user registrations
        if (recentUsers.length > 0) {
        activities.push({
            type: 'user_registration',
            message: `New user registered - ${recentUsers[0].name}`,
            timestamp: recentUsers[0].createdAt,
            icon: 'fas fa-user-plus'
        });
        }

        // Add orders
        if (recentOrders.length > 0) {
        activities.push({
            type: 'new_order',
            message: `New order #${recentOrders[0].orderNumber} placed`,
            timestamp: recentOrders[0].createdAt,
            icon: 'fas fa-shopping-cart'

        });
        }

        // Add inventory updates
        if (recentStockUpdates.length > 0) {
        activities.push({
            type: 'inventory_update',
            message: `Product "${recentStockUpdates[0].name}" stock updated`,
            timestamp: recentStockUpdates[0].stockUpdatedAt,
            icon: 'fas fa-box-open'
        });
        }

        // Add reviews
        // if (recentReviews.length > 0) {
        // activities.push({
        //     type: 'new_review',
        //     message: 'New customer review received',
        //     timestamp: recentReviews[0].createdAt,
        //     icon: '⭐'
        // });
        // }

        // 3. Sort activities by timestamp (newest first)
        activities.sort((a, b) => b.timestamp - a.timestamp);

        // 4. Format time ago
        const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        
        return 'Just now';
        };

        // 5. Prepare final response
        const response = activities.map(activity => ({
        type: activity.type,
        message: activity.message,
        timeAgo: formatTimeAgo(activity.timestamp),
        icon: activity.icon
        }));

        res.status(200).json({
        success: true,
        count: response.length,
        activities: response
        });

    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({
        success: false,
        message: 'Failed to fetch recent activity',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


/**
 * @desc    Get sales data grouped by week, month, and year
 * @route   GET /api/orders/sales
 * @access  Private/Admin
 */
export const getSalesData = asyncHandler(async (req, res) => {
  const matchStage = { isPaid: true };

  const [weekly, monthly, yearly] = await Promise.all([
    Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            week: { $isoWeek: '$createdAt' }
          },
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      {
        $project: {
          label: {
            $concat: [
              { $toString: '$_id.year' },
              '-W',
              { $toString: '$_id.week' }
            ]
          },
          totalSales: 1,
          orderCount: 1,
          _id: 0
        }
      }
    ]),
    Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          label: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lte: ['$_id.month', 9] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' }
                ]
              }
            ]
          },
          totalSales: 1,
          orderCount: 1,
          _id: 0
        }
      }
    ]),
    Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { year: { $year: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1 } },
      {
        $project: {
          label: { $toString: '$_id.year' },
          totalSales: 1,
          orderCount: 1,
          _id: 0
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      weekly,
      monthly,
      yearly
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