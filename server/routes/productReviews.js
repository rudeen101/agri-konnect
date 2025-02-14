// routes/reviews.js
const express = require('express');
const Review = require('../models/productReviews');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST add a review for a product
router.post('/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const newReview = new Review({ product: productId, user: req.user.userId, rating, comment });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// GET reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').lean();
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
