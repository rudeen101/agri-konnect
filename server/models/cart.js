const {
    Schema,
    model
  } = require("mongoose");

const cartSchema = new Schema({
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
    subTotal: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

}, {timestamp:true});

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

cartSchema.set('toJOSN', {
    virtual: true,
})


const Cart = model('cart', cartSchema);
module.exports = Cart;

