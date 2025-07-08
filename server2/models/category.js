import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    images: {
        type: [String],
    },
    color: {
        type: String,
    },
    type: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    parentId: {
        type: String,
    }

}, {timestamp:true});

const Category = mongoose.model("Category", categorySchema);
export default Category;

