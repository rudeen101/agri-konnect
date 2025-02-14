const  Cart = require('../models/cart');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { error } = require('console');
const { verifyToken, authorize } = require('../middleware/auth');


// GET user's cart
router.get('/:userId', verifyToken, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product').lean();
      res.json({ cart });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// POST add product to cart
router.post('/:userId', verifyToken, async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      let cart = await Cart.findOne({ user: req.params.userId });
      if (!cart) {
        cart = new Cart({ user: req.params.userId, items: [] });
      }

      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();

      res.json({ message: 'Product added to cart', cart });

    } catch (err) {
      res.status(500).json({ error: 'Failed to add product to cart' });
    }
});  

// DELETE remove product from cart
router.delete('/:userId/:productId', verifyToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await Cart.findOneAndUpdate({ user: userId }, { $pull: { items: { product: productId } } });
        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove product from cart' });
    }
});
  
module.exports = router;



