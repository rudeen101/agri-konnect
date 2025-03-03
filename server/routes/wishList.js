// routes/wishlist.js
const express = require('express');
const Wishlist = require('../models/wishList');
const Product = require('../models/product');
const { verifyToken } = require('../middleware/auth');
const calculatePopularityScore = require('../utils/calculatePopularityScore')

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
router.post('/add/:userId', verifyToken, async (req, res) => {
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


// Toggle Wishlist Status (Add/Remove)
router.post("/toggle", verifyToken, async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        // Check if the product is already in the wishlist
        const existingWish = await Wishlist.findOne({ user: userId, product: productId });

        if (existingWish) {
            // If found, remove from wishlist
            await Wishlist.deleteOne({ _id: existingWish._id });
            return res.status(200).json({ success: true, isWishlisted: false, msg: "Removed from Wishlist" });
        } else {
            // If not found, add to wishlist
            const newWish = new Wishlist({ user: userId, product: productId });
            await newWish.save();

            const product = await Product.findById(productId);
            product.wishlistCount += 1;
            product.popularityScore = calculatePopularityScore(product);

            await product.save();

            return res.status(201).json({ success: true, isWishlisted: true, msg: "Added to Wishlist" });
        }
    } catch (error) {
        console.error("Wishlist Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
