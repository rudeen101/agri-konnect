import mongoose from 'mongoose';

// const variantSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Variant name is required'],
//         trim: true
//     },
//     sku: {
//         type: String,
//         required: true,
//         unique: true,
//         uppercase: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: [0, 'Price must be positive']
//     },
//     inventory: {
//         type: Number,
//         required: true,
//         min: [0, 'Inventory cannot be negative'],
//         default: 0
//     },
//     attributes: {
//         color: String,
//         size: String,
//         weight: Number,
//         // Additional dynamic attributes
//         [String]: mongoose.Schema.Types.Mixed
//     },
//     images: [{
//         url: String,
//         publicId: String,
//         isPrimary: Boolean
//     }],
//     isActive: {
//         type: Boolean,
//         default: true
//     }
// }, { _id: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: 'text'
    },
    description: {
        type: String,
        required: true,
        maxlength: [500, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    // brand: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Brand'
    // },
    basePrice: {
        type: Number,
        required: true,
        min: [0, 'Price must be positive'],
        set: v => Number(v).toFixed(2) // Ensure proper number conversion
    },
    price: {
    type: Number,
    validate: {
        validator: function(value) {
        // Use typeof check instead of isModified
        if (typeof this.basePrice === 'undefined') return true;
        
        // Explicit number conversion
        const price = Number(value);
        const basePrice = Number(this.basePrice);
        
        return price >= basePrice;
        },
        message: function(props) {
        return `Price (${props.value}) must be ≥ base price (${this.basePrice || 'undefined'})`;
        }
    }
    },
    inventory: {
        type: Number,
        min: [0, 'Inventory cannot be negative'],
        default: 0
    },
    inventoryUpdatedAt: {
        type: Date,
        default: null
    },
    // variants: [variantSchema],
    images: [{
        url: String,
        publicId: String,
        // isPrimary: Boolean,
        altText: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    specifications: [{
        key: String,
        value: String,
        unit: String
    }],
    tags: [{
        type: String,
        lowercase: true,
        index: true
    }],
    ratings: {
        average: {
            type: Number,
            min: 1,
            max: 5,
            default: 1
        },
        count: {
            type: Number,
            default: 0
        }
    },
    lowInventoryThreshold: {
        type: Number,
        default: 10
    },
    minOrder: { 
        type: Number, 
        default: 0 
    }, 
    isFeatured: {
        type: Boolean,
        default: false
    },
    isTopSeller: {
        type:  Boolean,
        default: false
    },
    isPopular: {
        type:  Boolean,
        default: false
    },
    isRecommended: { 
        type: Boolean,
        default: false 
    },
    salesCount: 
    {   type: Number,
        default: 0 
    },
    wishlistCount: 
    {   type: Number,
        default: 0 
    },
    popularityScore: { 
        type: Number, 
        default: 0 
    },
    views: { 
        type: Number,
        default: 0 
    },
    isActive: {
        type: Boolean,
        default: true
    },

    packagingType: [
        {
            type: String,
            default: null
        }
    ],
    estimatedDeliveryDate: { 
        type: Number, 
        default: 0 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Virtual for product URL
productSchema.virtual('url').get(function() {
    return `/products/${this._id}`;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
    // Add type checking and ensure values exist
    if (typeof this.basePrice !== 'number' || typeof this.price !== 'number') {
        return 0;
    }
    
    // Only calculate if price is properly set
    if (this.price > 0 && this.basePrice > this.price) {
        return Math.round(((this.basePrice - this.price) / this.basePrice) * 100);
    }
    return 0;
},
 
);

// Middleware to update timestamps and track inventory changes
productSchema.pre('save', function(next) {
    const product = this;
  
    // Update general timestamps
    product.updatedAt = new Date();
  
    // Check if inventory is being modified
    if (product.isModified('inventory')) {
        // Get previous inventory value
        product.constructor.findById(product._id)
        
        // Update inventory update timestamp
        product.inventoryUpdatedAt = new Date();
    } 
    next();

});



// Indexes
productSchema.index({ name: 'text', description: 'text', 'tags': 'text' });
productSchema.index({ category: 1, isActive: 1, isFeatured: 1 });
productSchema.index({ 'variants.sku': 1 }, { unique: true, partialFilterExpression: { 'variants.sku': { $exists: true } } });

// Middleware to update variant inventory when main inventory changes
// productSchema.pre('save', function(next) {
//     if (this.isModified('inventory') && this.variants.length > 0) {
//         this.variants.forEach(variant => {
//             variant.inventory = this.inventory;
//         });
//     }
//     next();
// });

// Static method to get products by category
productSchema.statics.findByCategory = function(categoryId) {
    return this.find({ category: categoryId, isActive: true });
};

// Static method to update average rating
productSchema.statics.updateAverageRating = async function(productId) {
    const [result] = await this.aggregate([
        { $match: { _id: productId } },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        },
        {
            $addFields: {
                averageRating: { $avg: '$reviews.rating' },
                ratingsCount: { $size: '$reviews' }
            }
        }
    ]);

    if (result) {
        await this.findByIdAndUpdate(productId, {
            ratings: {
                average: result.averageRating || 0,
                count: result.ratingsCount || 0
            }
        });
    }
};



export default mongoose.model('Product', productSchema);