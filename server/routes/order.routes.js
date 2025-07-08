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
  myOrders,
  orderStatus,
  orderProcessing,
} from '../controllers/order.controller.js';
import { PERMISSIONS } from '../utils/permissions.js';

const router = express.Router();

// Create order (buyer only)
router.post('/',
  authenticate,
  requirePermission(PERMISSIONS.BUYER.CREATE_ORDER)
);

// Get user's orders (buyer)
router.get('/my-orders',
  authenticate,
  requirePermission(PERMISSIONS.BUYER.VIEW_ORDERS),
);

// Update order status (seller, agent, or admin)
router.put('/:id/status',
  authenticate,
  requireAnyPermission(
    PERMISSIONS.SELLER.UPDATE_ORDER_STATUS,
    PERMISSIONS.AGENT.UPDATE_ANY_ORDER,
    PERMISSIONS.ADMIN.MANAGE_ORDERS
  )
);

// Agent-specific order processing
router.post('/:id/process',
  authenticate,
  requireRole('agent'),
  requirePermission(PERMISSIONS.AGENT.PROCESS_ORDERS),
);

export default router;