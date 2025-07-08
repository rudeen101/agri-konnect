import express from 'express';
import {
  authenticate,
  requirePermission,
  requireRole,
  verifyOwner
} from '../middleware/authMiddleware';
import { PERMISSIONS } from '../utils/permissions';
import Order from '../models/Order';

const router = express.Router();

// Create order (buyer only)
router.post('/',
  authenticate,
  requirePermission(PERMISSIONS.BUYER.CREATE_ORDER),
  async (req, res) => {
    const order = await Order.create({
      ...req.body,
      user: req.user._id,
      status: 'pending'
    });
    res.status(201).json({ success: true, data: order });
  }
);

// Get user's orders (buyer)
router.get('/my-orders',
  authenticate,
  requirePermission(PERMISSIONS.BUYER.VIEW_ORDERS),
  async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json({ success: true, data: orders });
  }
);

// Update order status (seller, agent, or admin)
router.put('/:id/status',
  authenticate,
  requireAnyPermission(
    PERMISSIONS.SELLER.UPDATE_ORDER_STATUS,
    PERMISSIONS.AGENT.UPDATE_ANY_ORDER,
    PERMISSIONS.ADMIN.MANAGE_ORDERS
  ),
  async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: order });
  }
);

// Agent-specific order processing
router.post('/:id/process',
  authenticate,
  requireRole('agent'),
  requirePermission(PERMISSIONS.AGENT.PROCESS_ORDERS),
  async (req, res) => {
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
);

export default router;