import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import mongoose from 'mongoose';

class AnalyticsService {
    // Get dashboard summary statistics
    async getDashboardStats(timeRange = '30d') {
        const dateFilter = this.getDateFilter(timeRange);

        const [
            totalUsers,
            newUsers,
            totalOrders,
            completedOrders,
            totalRevenue,
            popularProducts
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: dateFilter }),
            Order.countDocuments(),
            Order.countDocuments({
                status: 'completed',
                createdAt: dateFilter
            }),
            this.getRevenueStats(dateFilter),
            this.getPopularProducts(dateFilter)
        ]);

        return {
            totalUsers,
            newUsers,
            totalOrders,
            completedOrders,
            totalRevenue,
            popularProducts
        };
    }

    // Get revenue statistics with comparison
    async getRevenueStats(dateFilter) {
        const currentPeriod = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: dateFilter
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' },
                    count: { $sum: 1 },
                    average: { $avg: '$total' }
                }
            }
        ]);

        // Get previous period for comparison
        const prevDateFilter = this.getComparisonDateFilter(dateFilter);
        const previousPeriod = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: prevDateFilter
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        return {
            current: currentPeriod[0] || { total: 0, count: 0, average: 0 },
            previous: previousPeriod[0]?.total || 0,
            growthRate: this.calculateGrowthRate(
                currentPeriod[0]?.total || 0,
                previousPeriod[0]?.total || 0
            )
        };
    }

    // Get user acquisition data
    async getUserAcquisition(timeRange = '30d') {
        const dateFilter = this.getDateFilter(timeRange);
        const groupBy = this.getGroupBy(timeRange);

        return User.aggregate([
            {
                $match: {
                    createdAt: dateFilter
                }
            },
            {
                $group: {
                    _id: groupBy,
                    count: { $sum: 1 },
                    sources: {
                        $push: {
                            $cond: [
                                { $ifNull: ['$social', false] },
                                { $arrayElemAt: [{ $objectToArray: '$social' }, 0] }.k,
                                'email'
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    date: '$_id',
                    count: 1,
                    sources: {
                        $reduce: {
                            input: '$sources',
                            initialValue: [],
                            in: {
                                $concatArrays: [
                                    '$$value',
                                    {
                                        $cond: [
                                            { $in: ['$$this', '$$value.source'] },
                                            [],
                                            [{
                                                source: '$$this',
                                                count: {
                                                    $size: {
                                                        $filter: {
                                                            input: '$sources',
                                                            as: 's',
                                                            cond: { $eq: ['$$s', '$$this'] }
                                                        }
                                                    }
                                                }
                                            }]
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            { $sort: { date: 1 } }
        ]);
    }

    // Get popular products
    async getPopularProducts(dateFilter, limit = 5) {
        return Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: dateFilter
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    productId: '$_id',
                    productName: '$product.name',
                    productImage: '$product.images.0.url',
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            }
        ]);
    }

    // Helper to calculate date filters
    getDateFilter(timeRange) {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case '24h':
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case '7d':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case '30d':
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case '90d':
                startDate = new Date(now.setDate(now.getDate() - 90));
                break;
            case 'ytd':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.setDate(now.getDate() - 30));
        }

        return { $gte: startDate };
    }

    // Helper to calculate growth rate
    calculateGrowthRate(current, previous) {
        if (previous === 0) return current === 0 ? 0 : 100;
        return ((current - previous) / previous) * 100;
    }
}

export default new AnalyticsService();