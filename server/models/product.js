const {Schema, mongoose,  model} = require("mongoose");
// var mongoose, = require('mongoose');


const productSchema = new Schema({
 
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
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    isFeatured: {
        type:  Boolean,
        default: false
    },
    discount: {
        type: Number,
        required: true
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
        default: Date.noe
    },
}, {timestamp:true});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

productSchema.set('toJOSN', {
    virtual: true,
})


const Product = model('Product', productSchema);
module.exports = Product;

