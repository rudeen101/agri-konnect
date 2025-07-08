import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    images: [
        {
            type: String,
            required: true
        }
    ],
    catId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
        required: true 
    },
    name: {
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
    }
}, {timestamp:true});

export default mongoose.model("Banner", BannerSchema);


// bannerSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// }); 

// bannerSchema.set('toJOSN', {
//     virtual: true,
// })


// const BannerSchema = model('banner', bannerSchema);
// export default BannerSchema;
