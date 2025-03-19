// routes/salesRoutes.js
const express = require("express");
const router = express.Router();
const {Order} = require("../models/order"); // Your Order Model
const mongoose = require("mongoose");

// GET Sales Data for Trends
router.get("/salesTrends", async (req, res) => {
    try {
        const salesTrends = await Order.aggregate([
            {
                $unwind: "$orderItems" // Flatten order items
            },
            { $match: { "status": "completed" } }, // Filter completed items
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    totalSales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } } // Sort by date
        ]);

        res.json(salesTrends);
    } catch (error) {
        console.error("Error fetching sales trends:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/revenueByCategory", async (req, res) => {
    const revenueByCategory = await Order.aggregate([
        { $unwind: "$orderItems" }, // Flatten order 
        { $match: { "status": "completed" } }, // Filter completed items
        {
            $group: {
                _id: "$orderItems.category", // Group by category
                totalRevenue: { $sum: "$orderItems.price" } // Sum the revenue
            }
        },
        { $sort: { totalRevenue: -1 } } // Sort by highest revenue
    ]);

    res.json(revenueByCategory);
    // return revenueByCategory; // Example: [{ _id: "Electronics", totalRevenue: 5000 }, ...]
});

// GET Sales History by Payment Status and Completion Status
router.get("/history", async (req, res) => {
    try {

        // Build query filter dynamically
        let filter = {
            status: "completed",
            paymentStatus: "paid",
            isReceived: true
        };

        // Fetch sales history based on filter
        const salesHistory = await Order.find(filter)
        .sort({ createdAt: -1 })
        .populate("orderedBy", "_id name")
        .populate("receivedBy", "_id name");
        
        res.status(200).json(salesHistory);
    } catch (error) {
        console.error("Error fetching sales history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;



module.exports = router;
