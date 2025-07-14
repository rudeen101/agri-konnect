import express from 'express';
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
  requireRole,
  verifyOwner
} from '../middlewares/auth.middleware.js';
import {
  createOrder,
  getOrders,
  // myOrders,
  orderStatus,
  getOrderStats,
  // orderProcessing,
} from '../controllers/order.controller.js';
import { PERMISSIONS } from '../utils/permissions.js';
import orderAdvancedResults from '../middlewares/orderAdvancedResults.middleware.js';
import Order from '../models/Order.model.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole('admin'),
  orderAdvancedResults(Order, { 
    path: 'user', 
    select: 'name contact',
    model: 'User' // Explicitly specify the model
  }),
  getOrders
);

// Create order (buyer only)
router.post('/create',
  authenticate,
  requireRole('admin'),
  createOrder
);

// Get user's orders (buyer)
// router.get('/my-orders',
//   authenticate,
//   requirePermission(PERMISSIONS.BUYER.VIEW_ORDERS),
//   myOrders
// );

// Update order status (seller, agent, or admin)
router.put('/:id/status',
  authenticate,
  // requireAnyPermission(
  //   PERMISSIONS.SELLER.UPDATE_ORDER_STATUS,
  //   PERMISSIONS.AGENT.UPDATE_ANY_ORDER,
  //   PERMISSIONS.ADMIN.MANAGE_ORDERS
  // ),
  requireRole('admin'),
  orderStatus
);

// // Agent-specific order processing
// router.post('/:id/process',
//   authenticate,
//   requireRole('agent'),
//   requirePermission(PERMISSIONS.AGENT.PROCESS_ORDERS),
//   orderProcessing
// );

router.get('/stats',
  authenticate, 
  requireRole('admin'), 
  getOrderStats
);


export default router;