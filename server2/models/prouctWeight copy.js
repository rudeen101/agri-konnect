import mongoose from "mongoose";

const productWeightSchema = mongoose.Schema({
    productWeight: [{
        type: String,
        default: null
    }]
})

productWeightSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

productWeightSchema.set('toJOSN', {
    virtual: true,
})

exports.ProductWeight = mongoose.model('ProductWeight', productWeightSchema);
exports.productWeightSchema = productWeightSchema;