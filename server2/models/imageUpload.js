import mongoose from "mongoose";

const imageUploadSchema = new mongoose.Schema({
    images: [{
        type: String,
        reauired: true
    }]
})

const ImageUpload = mongoose.model("ImageUpload", imageUploadSchema);
export default ImageUpload;
