import express from 'express';
import {
    getDashboardStats,
    getRecentActivity,
    getSalesData,
    // getUserAcquisition
} from '../controllers/dashboard.controller.js';
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
  requireRole,
  verifyOwner
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats',
    authenticate,
    getDashboardStats,
);
router.get('/activity', getRecentActivity);
router.get('/sales', getSalesData);
// router.get('/acquisition', getUserAcquisition);

// Time-based analytics
// router.get('/analytics/:timeframe', getTimeBasedAnalytics);

// Custom report generation
// router.post('/reports/generate', generateCustomReport);

export default router;