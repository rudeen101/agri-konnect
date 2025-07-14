import Order from "../models/Order.model.js";

// Create order (buyer only)
export const createOrder = async (req, res) => {

    const order = await Order.create({
      ...req.body,
      user: req.user._id,
      status: 'pending'
    });
    res.status(201).json({ success: true, data: order });
}

export const getOrders = async (req, res) => {
    res.status(200).json(res.orderAdvancedResults);

};

// Get user's orders (buyer)
export const myOrders = async (req, res) => {

    const orders = await Order.find({ user: req.user._id });
    res.json({ success: true, data: orders });
}

// Update order status (seller, agent, or admin)
export const orderStatus = async (req, res) => {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: order });
}

// Agent-specific order processing
export const orderProcessing = async (req, res) => {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'processing',
        processedBy: req.user._id,
        processedAt: new Date()
      },
      { new: true }
    );
    res.json({ success: true, data: order });
}


// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    // Get current date and calculate time ranges
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // Main statistics aggregation
    const stats = await Order.aggregate([
        {
        $facet: {
            // Total summary
            summary: [
            {
                $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
                pendingOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                },
                processingOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] }
                },
                shippedOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] }
                },
                deliveredOrders: {
                    $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
                }
                }
            }
            ],
            // Daily stats
            daily: [
            { $match: { createdAt: { $gte: today } } },
            {
                $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: "$totalPrice" }
                }
            }
            ],
            // Monthly stats
            monthly: [
            { $match: { createdAt: { $gte: thisMonth } } },
            {
                $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: "$totalPrice" }
                }
            }
            ],
            // Yearly stats
            yearly: [
            { $match: { createdAt: { $gte: thisYear } } },
            {
                $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: "$totalPrice" }
                }
            }
            ],
            // Status distribution
            statusDistribution: [
            {
                $group: {
                _id: "$status",
                count: { $sum: 1 },
                revenue: { $sum: "$totalPrice" }
                }
            }
            ],
            // Recent orders
            recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
                $project: {
                orderNumber: 1,
                status: 1,
                totalPrice: 1,
                createdAt: 1,
                user: 1
                }
            }
            ]
        }
        },
        {
        $project: {
            summary: { $arrayElemAt: ["$summary", 0] },
            daily: { $arrayElemAt: ["$daily", 0] },
            monthly: { $arrayElemAt: ["$monthly", 0] },
            yearly: { $arrayElemAt: ["$yearly", 0] },
            statusDistribution: 1,
            recentOrders: 1
        }
        }
    ]);

    // Format the response
    const result = {
      totalOrders: stats[0]?.summary?.totalOrders || 0,
      totalRevenue: stats[0]?.summary?.totalRevenue || 0,
      pendingOrders: stats[0]?.summary?.pendingOrders || 0,
      processingOrders: stats[0]?.summary?.processingOrders || 0,
      shippedOrders: stats[0]?.summary?.shippedOrders || 0,
      deliveredOrders: stats[0]?.summary?.deliveredOrders || 0,
      dailyStats: {
        orders: stats[0]?.daily?.count || 0,
        revenue: stats[0]?.daily?.revenue || 0
      },
      monthlyStats: {
        orders: stats[0]?.monthly?.count || 0,
        revenue: stats[0]?.monthly?.revenue || 0
      },
      yearlyStats: {
        orders: stats[0]?.yearly?.count || 0,
        revenue: stats[0]?.yearly?.revenue || 0
      },
      statusDistribution: stats[0]?.statusDistribution || [],
      recentOrders: stats[0]?.recentOrders || []
    };

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

