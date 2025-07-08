import mongoose from "mongoose";

const productSizeSchema = mongoose.Schema({
    productWeight: [{
        type: String,
        default: null
    }]
})

productSizeSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

productSizeSchema.set('toJOSN', {
    virtual: true,
})

exports.ProductSize = mongoose.model('ProductSize', productSizeSchema);
exports.productSizeSchema = productSizeSchema;