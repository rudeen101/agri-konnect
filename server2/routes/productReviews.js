import express from "express";
import Review from "../models/productReviews.js";
import Product from "../models/product.js"
import verifyBuyer from "../middleware/verifyBuyer.js"
import { verifyToken, authorize } from "../middleware/auth.js"
const router = express.Router();

//**Submit a New Review (Only Verified Buyers)**
router.post("/add", verifyToken, verifyBuyer, async (req, res) => {
 
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id; // Get user from token

        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        // Create the new review
        const review = new Review({
            user: userId,
            product: productId,
            rating,
            comment
        });

        await review.save();

        // Update Product rating
        const reviews = await Review.find({ product: productId });
        const totalRating = reviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avgRating = totalRating / reviews.length;

        const product = await Product.findById(productId)
        product.averageRating = avgRating;
        product.reviewCount = reviews.length;
        product.popularityScore = calculatePopularityScore(product);

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// **Get Reviews by product Id**
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const reviews = await Review.find({product: id})
            .populate("user", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//**Edit Review (Only the Review Author)**
router.put("/:reviewId", verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: "Review not found." });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to edit this review." });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        review.status = "pending"; // Resets approval after edit
        await review.save();

        res.status(200).json({ message: "Review updated.", review });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// **Delete Review (Only the Review Author or Admin)**
router.delete("/:reviewId", verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: "Review not found." });

        await review.deleteOne();
        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// **Get Approved Product Reviews**
router.get("/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId, status: "approved" })
            .populate("user", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//**Admin: Get Pending Reviews**
router.get("/admin/pending", verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const reviews = await Review.find({ status: "pending" }).populate("user", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//**Admin: Approve or Reject Review**
router.put("/admin/:reviewId", verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: "Review not found." });

        review.status = req.body.status; // "approved" or "rejected"
        await review.save();

        res.status(200).json({ message: `Review ${review.status}.`, review });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;



















// // routes/reviews.js
// import express from "express"
// const Review = require('../models/productReviews');
// const { verifyToken } = require('../middleware/auth');

// const router = express.Router();

// // POST add a review for a product
// router.post('/:productId', verifyToken, async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { rating, comment } = req.body;
//     const newReview = new Review({ product: productId, user: req.user.userId, rating, comment });
//     await newReview.save();
//     res.status(201).json({ message: 'Review submitted successfully', review: newReview });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to submit review' });
//   }
// });

// // GET reviews for a product
// router.get('/:productId', async (req, res) => {
//   try {
//     const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').lean();
//     res.json({ reviews });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch reviews' });
//   }
// });

// export default router;
