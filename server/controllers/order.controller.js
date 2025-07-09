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

