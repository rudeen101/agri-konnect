import mongoose from 'mongoose';
import slugify from 'slugify';

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Brand name cannot exceed 50 characters'],
        index: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    logo: {
        url: String,
        publicId: String,
        altText: String
    },
    website: {
        type: String,
        match: [/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
        'Please use a valid URL with HTTP or HTTPS']
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    seo: {
        title: String,
        metaDescription: String,
        keywords: [String]
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        youtube: String
    },
    contact: {
        email: String,
        phone: String,
        address: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate slug before saving
brandSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Virtual for product count
brandSchema.virtual('productCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'brand',
    count: true
});

// Virtual for featured products
brandSchema.virtual('featuredProducts', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'brand',
    match: { isFeatured: true },
    options: { limit: 5 }
});

// Static method to get brands with product counts
brandSchema.statics.getBrandsWithCounts = async function() {
    return this.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'brand',
                as: 'products'
            }
        },
        {
            $project: {
                name: 1,
                slug: 1,
                logo: 1,
                productCount: { $size: '$products' }
            }
        },
        { $sort: { name: 1 } }
    ]);
};

// Indexes
brandSchema.index({ slug: 1 });
brandSchema.index({ isFeatured: 1, name: 1 });

export default mongoose.model('Brand', brandSchema);