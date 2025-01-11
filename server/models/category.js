const {
    Schema,
    model
  } = require("mongoose");

const categorySchema = new Schema({
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
    parentId: {
        type: String,
    }

}, {timestamp:true});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

categorySchema.set('toJOSN', {
    virtual: true,
})


const Category = model('category', categorySchema);
module.exports = Category;

