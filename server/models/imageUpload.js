const mongoose = require("mongoose");

const imageUploadSchema = mongoose.Schema({
    images: [{
        type: String,
        reauired: true
    }]
})

imageUploadSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

imageUploadSchema.set('toJOSN', {
    virtual: true,
})

exports.ImageUpload = mongoose.model('ImageUpload', imageUploadSchema);
exports.imageUploadSchema = imageUploadSchema;