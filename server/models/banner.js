const {
    Schema,
    model
  } = require("mongoose");

const bannerSchema = new Schema({
    images: [
        {
            type: String,
            required: true
        }
    ],
    catId: {
        type: String,
    },
    catName: {
        type: String,
    },
    subCatId: {
        type: String,
    },
    subCatName: {
        type: String,
    },
    catId: {
        type: String,
    },



}, {timestamp:true});

bannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

bannerSchema.set('toJOSN', {
    virtual: true,
})


const BannerSchema = model('banner', bannerSchema);
module.exports = BannerSchema;
