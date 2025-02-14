// routes/orders.js
const express = require('express');
const Order = require('../models/order');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST create an order
router.post('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, total } = req.body;
    const newOrder = new Order({ user: userId, items, total });
    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
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
