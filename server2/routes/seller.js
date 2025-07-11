// routes/seller.js
import express from "express"
import { verifyToken, authorize } from "../middleware/auth.js"
import Seller from "../models/seller.js"
import Product from '../models/product.js';
import User from "../models/users.js";

const router = express.Router();

// Apply to become a seller
router.post("/signup", verifyToken, async (req, res) => {
  try {
    const { businessName, address, contact, businessType, products } = req.body;
	
    // Check if seller already exists
    const existingSeller = await Seller.findOne({ user: req.user.id });
    if (existingSeller) return res.status(400).json({ message: "You have already applied to become a seller." });

    const seller = new Seller({ user: req.user.id, businessName, address, contact, businessType, products });
    await seller.save();

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
	console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});

// Get seller status
router.get("/status", verifyToken, async (req, res) => {
	try {
		const seller = await Seller.findOne({ user: req.user.id });
		if (!seller) return res.status(404).json({ message: "Seller application not found." });

		res.json(seller);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
});

// Admin - Approve or Reject Seller Application
router.put("/:id/status", authorize(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    seller.status = status;
    await seller.save();
    res.json({ message: `Seller status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

















/**
 * GET /api/seller/dashboard
 * Returns seller dashboard data including seller profile, products, and orders.
 */
// router.get('/dashboard', verifyToken, authorize(['seller', 'admin']), async (req, res) => {
//   try {
//     // Find seller profile by the logged in user's id
//     const seller = await Seller.findOne({ user: req.user.userId }).lean();
//     if (!seller) {
//       return res.status(404).json({ error: 'Seller profile not found' });
//     }
//     // Fetch products created by this seller
//     const products = await Product.find({ seller: seller._id }).lean();
//     // Fetch orders for this seller
//     // Assumes that each order's items reference products and we can filter orders based on seller
//     // For simplicity, we query orders that contain products from this seller.
//     const orders = await Order.find({}).populate('items.product').lean();
//     const sellerOrders = orders.filter(order => 
//       order.items.some(item => item.product.seller?.toString() === seller._id.toString())
//     );
//     res.json({ seller, products, orders: sellerOrders });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch seller dashboard data' });
//   }
// });

// /**
//  * GET /api/seller/profile
//  * Retrieve the seller profile.
//  */
// router.get('/profile', verifyToken, authorize(['seller']), async (req, res) => {
//   try {
//     const seller = await Seller.findOne({ user: req.user.userId }).lean();
//     if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
//     res.json({ seller });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch seller profile' });
//   }
// });

// /**
//  * POST /api/seller/profile
//  * Create a seller profile. Only available for users with seller role.
//  */
// router.post('/profile', verifyToken, authorize(['seller']), async (req, res) => {
//   try {
//     const existingSeller = await Seller.findOne({ user: req.user.userId });
//     if (existingSeller) {
//       return res.status(400).json({ error: 'Seller profile already exists' });
//     }
//     const newSeller = new Seller({ user: req.user.userId, ...req.body });
//     await newSeller.save();
//     res.status(201).json({ message: 'Seller profile created successfully', seller: newSeller });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create seller profile' });
//   }
// });

// /**
//  * PUT /api/seller/profile
//  * Update the seller profile.
//  */
// router.put('/profile', verifyToken, authorize(['seller']), async (req, res) => {
//   try {
//     const updatedSeller = await Seller.findOneAndUpdate(
//       { user: req.user.userId },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedSeller) return res.status(404).json({ error: 'Seller profile not found' });
//     res.json({ message: 'Seller profile updated successfully', seller: updatedSeller });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update seller profile' });
//   }
// });

// /**
//  * GET /api/seller/products
//  * Fetch all products for the seller.
//  */
// router.get('/products', verifyToken, authorize(['seller', 'admin']), async (req, res) => {
//   try {
//     const seller = await Seller.findOne({ user: req.user.userId });
//     if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
//     const products = await Product.find({ seller: seller._id }).lean();
//     res.json({ products });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch products for seller' });
//   }
// });

// /**
//  * POST /api/seller/products
//  * Create a new product by the seller.
//  */
// router.post('/products', verifyToken, authorize(['seller', 'admin']), async (req, res) => {
//   try {
//     const seller = await Seller.findOne({ user: req.user.userId });
//     if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
//     const newProduct = new Product({ ...req.body, seller: seller._id });
//     await newProduct.save();
//     res.status(201).json({ message: 'Product created successfully', product: newProduct });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

/**
 * PUT /api/seller/products/:productId
 * Update a product. Ensure that the product belongs to the seller.
 */
router.put('/products/:productId', verifyToken, authorize(['seller', 'admin']), async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
    const product = await Product.findOne({ _id: req.params.productId, seller: seller._id });
    if (!product) return res.status(404).json({ error: 'Product not found or unauthorized' });
    Object.assign(product, req.body);
    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/seller/products/:productId
 * Delete a product if it belongs to the seller.
 */
router.delete('/products/:productId', verifyToken, authorize(['seller', 'admin']), async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) return res.status(404).json({ error: 'Seller profile not found' });
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.productId, seller: seller._id });
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// export default router;
