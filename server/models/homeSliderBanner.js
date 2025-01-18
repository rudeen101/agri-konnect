const {
    Schema,
    model
  } = require("mongoose");

const homeSliderBannerSchema = new Schema({
    images: [
        {
            type: String,
            required: true
        }
    ],
}, {timestamp:true});

homeSliderBannerSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

homeSliderBannerSchema.set('toJOSN', {
    virtual: true,
})


const HomeSliderBannerSchema = model('homeSliderBanner', homeSliderBannerSchema);
module.exports = HomeSliderBannerSchema;

