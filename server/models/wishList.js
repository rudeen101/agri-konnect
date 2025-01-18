const {
    Schema,
    model
  } = require("mongoose");

const wishListSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },

}, {timestamp:true});

wishListSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

wishListSchema.set('toJOSN', {
    virtual: true,
})


const WishList = model('wishList', wishListSchema);
module.exports = WishList;

