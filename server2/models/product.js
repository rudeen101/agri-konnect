import mongoose from "mongoose";

const productSchema = mongoose.Schema({
 
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images:[
        {
            type: String,
            required: true
        }
    ],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    catName: {
        type: String,
        default: ''
    },
    catId: {
        type: String,
        default: ''
    },
    subCatId: {
        type: String,
        default: ''
    },
    subCat: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    isFeatured: {
        type:  Boolean,
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
    // size: [
    //     {
    //         type: String,
    //         default: null
    //     }
    // ],
    productWeight: [
        {
            type: String,
            default: null
        }
    ],

    packagingType: [
        {
            type: String,
            default: null
        }
    ],

    location: {
        type: String,
        default: "All"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    estimatedDeliveryDate: { 
        type: Number, 
        default: 0 
    },
    views: { 
        type: Number,
        default: 0 
    },
    isRecommended: { 
        type: Boolean,
        default: false 
    },

    averageRating: { 
        type: Number, 
        default: 0 
    }, // Avg rating (e.g., 4.5)
    reviewCount: { 
        type: Number, 
        default: 0 
    }, // Number of reviews
    minOrder: { 
        type: Number, 
        default: 0 
    }, // Number of reviews
    
    lastInteraction: { 
        type: Date, 
        default: Date.now 
    }, // Last update time

    tags: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: "Tag" 
        }
    ], // Reference to Tag model
    
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        // required: true,
    }


}, {timestamp:true});

const Product = mongoose.model("Product", productSchema);
export default Product;
