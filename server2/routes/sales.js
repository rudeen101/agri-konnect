// routes/salesRoutes.js
import express from "express";
const router = express.Router();
import Order from "../models/order.js" // Your Order Model
import mongoose from "mongoose";
import { verifyToken, authorize } from "../middleware/auth.js"
import Seller from "../models/seller.js";
import { MongoClient, ObjectId } from "mongodb";

// GET Sales Data for Trends
router.get("/salesTrends", verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const salesTrends = await Order.aggregate([
            {
                $unwind: "$orderItems" // Flatten order items
            },
            { $match: { orderedBy: new ObjectId(req.user.id), "status": "completed" } }, // Filter completed items
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

// GET Sales Data for Trends for a specific user
router.get("/user/salesTrends", verifyToken, async (req, res) => {
    try {

        // Check if the user is an approved seller
        const seller = await Seller.findOne({
            user: req.user.id,
            status: "Approved", // Ensure the seller is approved
        });
        if (!seller) return res.status(403).json({ message: 'Access denied. Seller is not approved.'});

        const salesTrends = await Order.aggregate([
            {
                $unwind: "$orderItems" // Flatten order items
            },
            { $match: { "receivedBy": req.user.id, "status": "completed" } }, // Filter completed items
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

// GET Order Data for Trends for a specific user
router.get("/user/orderTrends", verifyToken, async (req, res) => {
    try {

        const orderTrends = await Order.aggregate([
            
            {
                $unwind: "$orderItems" // Flatten order items
            },

            { 
                $match: { 
                    status: "completed",
                    orderedBy: new ObjectId(req.user.id)
                } 
            }, // Filter completed items
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

        res.json(orderTrends);
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


export default router;