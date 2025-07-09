import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  deleteProductImage,
  updateProduct,
  // deleteProduct,
  // getByCategory
} from '../controllers/product.controller.js';

import { 
    authenticate,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireRole 
} from '../middlewares/auth.middleware.js';

import advancedResults from '../middlewares/orderAdvanceResults.middleware.js.js';
import Product from '../models/Product.model.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRole('admin'),
  advancedResults(Product, ['category']),
  getProducts
);

router.get(
  '/:id', 
  authenticate,
  requireRole('admin'), 
  getProduct
);

router.post(
  '/',
  authenticate,
  requireRole('admin', 'manager'),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  // requireRole('admin', 'manager'),
  updateProduct
);

// router.delete(
//   '/:id',
//   authenticate,
//   requireRole('admin'),
//   deleteProduct
// );
router.delete(
  '/image',
  authenticate,
  requireRole('admin'),
  deleteProductImage
);

// router.get(
//   '/category/:categoryId',
//   authenticate,
//   getByCategory
// );

export default router;
