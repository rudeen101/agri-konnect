
import mongoose from "mongoose";
const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },

    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true 
    },

    createdAt: {
        type: Date,
        default: Date.now 
    },

}, {timestamp:true});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;

