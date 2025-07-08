import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product'],
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
        index: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must not exceed 5']
    },
    title: {
        type: String,
        required: [true, 'Please provide a review title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    images: [{
        url: String,
        publicId: String
    }],
    verifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpful: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    response: {
        text: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent duplicate reviews from same user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get average rating for a product
reviewSchema.statics.calcAverageRatings = async function(productId) {
    const stats = await this.aggregate([
        {
            $match: { product: productId, isApproved: true }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratings: {
                average: stats[0].avgRating,
                count: stats[0].nRating
            }
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratings: {
                average: 0,
                count: 0
            }
        });
    }
};

// Update product ratings after saving a review
reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.product);
});

// Update product ratings after removing a review
reviewSchema.post('remove', function() {
    this.constructor.calcAverageRatings(this.product);
});

// Static method to get helpful reviews for a user
reviewSchema.statics.getHelpfulReviews = async function(userId, limit = 5) {
    return this.find({
        'helpful.users': userId,
        isApproved: true
    })
        .sort('-helpful.count')
        .limit(limit)
        .populate('product', 'name images')
        .populate('user', 'name');
};

// Query middleware to only show approved reviews by default
reviewSchema.pre(/^find/, function(next) {
    if (this.getFilter().isApproved === undefined) {
        this.find({ isApproved: true });
    }
    next();
});

export default mongoose.model('Review', reviewSchema);