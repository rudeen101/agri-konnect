// routes/wishlist.js
const express = require('express');
const Wishlist = require('../models/wishList');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET wishlist for a user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.params.userId }).populate('product').lean();
        res.json({ wishlist });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// POST add a product to wishlist
router.post('/:userId', verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        
        const exists = await Wishlist.findOne({ user: req.params.userId, product: productId });
        if (exists) return res.status(400).json({ error: 'Product already in wishlist' });

        const newEntry = new Wishlist({ user: req.params.userId, product: productId });
        await newEntry.save();

        res.status(201).json({ message: 'Product added to wishlist', wishlist: newEntry });

    } catch (err) {
        res.status(500).json({ error: 'Failed to add product to wishlist' });
    }
});

// DELETE remove product from wishlist
router.delete('/:userId/:productId', verifyToken, async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ user: req.params.userId, product: req.params.productId });

        res.json({ message: 'Product removed from wishlist' });

    } catch (err) {
        res.status(500).json({ error: 'Failed to remove product from wishlist' });
    }
});

module.exports = router;
