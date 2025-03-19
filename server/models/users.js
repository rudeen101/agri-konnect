const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "Liberia" },
    pickupStation: { type: String, default: "" } // Optional field for pickup stations
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: false
    },

    roles: { 
        type: [String], 
        enum: ['admin', 'seller', "superAdmin", "agent", "buyerAgent", "sellerAgent", 'buyer'], 
        default: 'buyer',
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

    salesHistory: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        }
    ],
    refreshToken: { 
        type: String 
    }, // Store refresh token in DB

    addresses: { 
        type: [addressSchema], 
        default: [] 
    }, // Stores multiple addresses

    deleted: { 
        type: Boolean, 
        default: false 
    },  // Soft delete flag

    createdAt: { 
        type: Date, 
        default: Date.now
    }, 

    deletedAt: { 
        type: Date, 
        default: null 
    } // Timestamp for audit logs


});


// Middleware to Prevent Unauthorized Role Updates
UserSchema.pre("save", async function (next) {
    if (!this.isModified("roles")) return next(); // Skip if roles are not being updated

    const existingUser = await mongoose.model("User").findById(this._id);
    if (!existingUser) return next(); // New users are fine

    const newRoles = this.roles;
    const oldRoles = existingUser.roles;

    //Prevent users from adding "admin" unless they were already admin
    if (!oldRoles.includes("admin") && newRoles.includes("admin")) {
        return next(new Error("Unauthorized role update: Only super admins can assign 'admin'"));
    }

    //Prevent users from assigning themselves new roles unless an admin is doing it
    if (!this._adminApproved) {
        return next(new Error("Unauthorized role update: Only admins can assign new roles"));
    }

    next();
});

UserSchema.methods.approveRoleUpdate = function () {
    this._adminApproved = true;
};

module.exports = mongoose.model("User", UserSchema);


