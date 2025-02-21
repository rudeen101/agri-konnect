// routes/orders.js
const express = require('express');
const Order = require('../models/order');
const User = require('../models/users');
const { verifyToken } = require('../middleware/auth');
const crypto = require("crypto");

const router = express.Router();




// Create a new order
router.post("/create", verifyToken, async (req, res) => {

	try {
		const { deliveryAddress, paymentDetails, orderItems, totalPrice } = req.body;

		if (!deliveryAddress || !paymentDetails || !orderItems.length || !totalPrice) {
			return res.status(400).json({ error: "All fields are required!" });
		}

		const generateOrderNumber = () => {
			return `ORD-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
		};

		// Create new order
		const newOrder = new Order({
			orderNumber: generateOrderNumber(), 
			user: req.user.id,
			deliveryAddress,
			paymentDetails,
			orderItems,
			totalPrice
		});

		await newOrder.save();

		// Update the user's address
		await User.findByIdAndUpdate(req.user.id, { $set: { addresses: deliveryAddress } });

		return res.status(201).json({ message: "Order placed successfully", order: newOrder });

		res.status(201).json({ message: "Order placed successfully!", order: newOrder });
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: "Server error while placing order." });
	}
});

// GET order details by order ID
router.get('/details/:orderId', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product').lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// GET only the last order number for a specific user
router.get("/number", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const lastOrder = await Order.findOne({ user: req.user.id }) // Get only the latest order
            .sort({ createdAt: -1 }) // Sort by most recent
            .select("orderNumber totalPrice") // Select only orderNumber and totalPrice fields
            .exec();

        if (!lastOrder) {
            return res.status(404).json({ message: "No order found for this user" });
        }

		res.status(200).json({ 
            orderNumber: lastOrder.orderNumber, 
            totalPrice: lastOrder.totalPrice 
        });
	} catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET orders for a user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
