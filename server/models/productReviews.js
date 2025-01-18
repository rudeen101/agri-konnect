const {
    Schema,
    model
  } = require("mongoose");

const productReviewsSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    customerRating: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },

}, {timestamp:true});

productReviewsSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

productReviewsSchema.set('toJOSN', {
    virtual: true,
})


const ProductReviews = model('productReviews', productReviewsSchema);
module.exports = ProductReviews;

