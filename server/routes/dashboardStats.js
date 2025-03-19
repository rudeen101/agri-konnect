const express = require("express");
const router = express.Router();
// const { getDashboardStats } = require("../controllers/dashboardController");

const { Order } = require("../models/order");
const User = require("../models/users");
const Product = require("../models/product");

router.get("/stats", async (req, res) => {
    try {
        // Total Revenue
        const totalRevenue = await Order.aggregate([
            { $unwind: "$orderItems" }, // // Deconstructs orderItems array
            { $match: { "orderItems.status": "completed" } }, // Filter completed items
            { 
                $group: { 
                    _id: null, 
                    totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
                }
            }
        ]);

        // New Customers (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newCustomers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const newProducts = await Product.countDocuments({ dateCreated: { $gte: thirtyDaysAgo } });

        // Customer Retention (Customers who ordered more than once)
        const returningCustomers = await Order.aggregate([
            { $group: { _id: "$orderedBy", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $count: "returningCustomers" },
        ]);

        // // Profit Calculation (Revenue - Cost)
        // const totalCost = await Order.aggregate([
        //     { $match: { status: "delivered" } },
        //     { $group: { _id: null, totalCost: { $sum: "$cost" } } }, // Assuming `cost` field in Order model
        // ]);

        const revenue = totalRevenue[0]?.totalRevenue || 0;
        // const cost = totalCost[0]?.totalCost || 0;


        res.json({
            totalRevenue: revenue,
            newCustomers,
            customerRetention: returningCustomers[0]?.returningCustomers || 0,
            newProducts,
        });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
