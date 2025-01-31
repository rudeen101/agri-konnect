const {
    Schema,
    model,
    mongoose
} = require("mongoose");


const tagSchema = new Schema({
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

tagSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

tagSchema.set('toJOSN', {
    virtual: true,
})


const Tag = model('tag', tagSchema);
module.exports = Tag;

