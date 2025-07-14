import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';

import { 
    authenticate,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireRole 
} from '../middlewares/auth.middleware.js';

import advancedResults from '../middlewares/orderAdvancedResults.middleware.js'
import CategoryModel from '../models/Category.model.js';

const router = express.Router();

// Public
router.get(
    '/',
    // advancedResults(CategoryModel, "categories"), 
    getCategories
);
router.get('/:id', getCategory);

// Protected Admin/Manager routes
router.post(
  '/',
  authenticate,
  requireRole("admin"),
  createCategory
);

router.put(
  '/:id',
  authenticate,
  requireRole(["admin", "superAdmin"]),
  updateCategory
);

router.delete(
  '/:id',
  authenticate,
  requireRole("admin"),
  deleteCategory
);

export default router;
