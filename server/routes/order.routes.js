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
  getOrders
  // myOrders,
  // orderStatus,
  // orderProcessing,
} from '../controllers/order.controller.js';
import { PERMISSIONS } from '../utils/permissions.js';
import advanceResults from '../middlewares/orderAdvanceResults.middleware.js.js';
import orderAdvanceResults from '../middlewares/orderAdvanceResults.middleware.js.js';
import Order from '../models/Order.model.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole('admin'),
  orderAdvanceResults(Order, [{
      path: 'user',
      select: 'name email'
    },
    {
      path: 'orderItems.product',
      select: 'name price images'
    }]),
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
// router.put('/:id/status',
//   authenticate,
//   requireAnyPermission(
//     PERMISSIONS.SELLER.UPDATE_ORDER_STATUS,
//     PERMISSIONS.AGENT.UPDATE_ANY_ORDER,
//     PERMISSIONS.ADMIN.MANAGE_ORDERS
//   ),
//   orderStatus
// );

// // Agent-specific order processing
// router.post('/:id/process',
//   authenticate,
//   requireRole('agent'),
//   requirePermission(PERMISSIONS.AGENT.PROCESS_ORDERS),
//   orderProcessing
// );

export default router;