const {
    Schema,
    model,
    mongoose
  } = require("mongoose");


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

    recentlyViewed: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    ],
    purchaseHistory: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    ],


}, {timestamp:true});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

userSchema.set('toJOSN', {
    virtual: true,
})


const User = model('user', userSchema);
module.exports = User;

