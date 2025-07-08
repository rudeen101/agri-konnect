import express from "express";
const router = express.Router();

import Order from "../models/order.js"
import User from "../models/users.js"
import Product from "../models/product.js"
import WishList from "../models/wishList.js";
import ProductReviews from "../models/productReviews.js";
import { verifyToken, authorize } from "../middleware/auth.js"

router.get("/stats", verifyToken, authorize(["admin"]), async (req, res) => {
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

router.get("/user/buyer/stats", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get the current month's start and end dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
        // Fetch orders placed this month
        const orders = await Order.find({
          orderedBy: userId,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });
    
        // Calculate total spent
        const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
        // Fetch wishlist items
        const wishlistItems = await WishList.find({ userId }).countDocuments();

        // Fetch reviews given
        const reviewsGiven = await ProductReviews.find({ userId }).countDocuments();
           
        // Return the data
        res.json({
          ordersPlaced: orders.length,
          totalSpent,
          wishlistItems,
          reviewsGiven,

        });
      } catch (error) {
        console.log(error)
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
});

router.get("/user/seller/stats", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        

        // Get the current month's start and end dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
        // Fetch total orders received
        const totalOrders = await Order.find({ receivedBy: userId }).countDocuments();

        // Fetch total revenue this month
        const ordersThisMonth = await Order.find({
        userId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });
        const totalRevenue = ordersThisMonth.reduce((sum, order) => sum + order.totalPrice, 0);

        // Fetch pending orders
        const pendingOrders = await Order.find({ userId, status: 'pending' }).countDocuments();

        // Fetch average rating
        const reviews = await ProductReviews.find({ userId });
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    
        // Return the data
        res.json({
            totalOrders,
            totalRevenue,
            pendingOrders,
            averageRating,
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
});


export default router;
