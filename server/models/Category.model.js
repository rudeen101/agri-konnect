import mongoose from 'mongoose';
import slugify from 'slugify';
import Product from './Product.model.js'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot exceed 50 characters'],
        index: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    ancestors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    image: {
        url: String,
        publicId: String,
        altText: String
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    seo: {
        title: String,
        metaDescription: String,
        keywords: [String]
    },
    customFields: mongoose.Schema.Types.Mixed,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Update ancestors when parent changes
categorySchema.pre('save', async function(next) {
    if (this.isModified('parent')) {
        const ancestors = [];
        if (this.parent) {
            const parent = await this.constructor.findById(this.parent);
            if (parent) {
                ancestors.push(...parent.ancestors, parent._id);
            }
        }
        this.ancestors = ancestors;
        
        // Update all descendants
        if (this.children.length > 0) {
            await this.constructor.updateMany(
                { _id: { $in: this.children } },
                { $set: { ancestors: [...this.ancestors, this._id] } }
            );
        }
    }
    next();
});

// Virtual for product count
categorySchema.virtual('productCount', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
    count: true
});

// Static method to build category tree
categorySchema.statics.getTree = async function() {
    const categories = await this.find({}).sort('displayOrder');
    
    const buildTree = (parentId = null) => {
        return categories
            .filter(cat => (cat.parent && cat.parent.equals(parentId)) || 
                           (!cat.parent && !parentId))
            .map(cat => ({
                ...cat.toObject(),
                children: buildTree(cat._id)
            }));
    };

    return buildTree();
};

// Static method to get all descendants
categorySchema.statics.getDescendants = async function(categoryId) {
    const category = await this.findById(categoryId);
    if (!category) return [];
    
    return this.find({ ancestors: categoryId });
};


export default mongoose.model('Category', categorySchema);