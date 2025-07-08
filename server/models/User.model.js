import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PERMISSIONS, ROLES, getRolePermissions } from '../utils/permissions.js';

const addressSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "Liberia" },
    pickupStation: { type: String, default: "" } // Optional field for pickup stations
});


const userSchema = new mongoose.Schema({
    // Identity fields
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [30, 'First name cannot exceed 30 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [30, 'Last name cannot exceed 30 characters']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    contact: {
        type: String,
        required: [true, 'Please add a contact number or email'],
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return v === '' || /^\+?[\d\s-]{10,}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/80'
    },

    // Authentication fields
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'active'
    },
    role: {
        type: String,
        enum: Object.values(ROLES).map(r => r.name),
        default: 'buyer',
    },
    permissions: {
        type: [String],
        default: [],
    },
    sellerProfile: {
        businessName: String,
        businessAddress: String,
        businessCity: String,
        businessCounty: String,
        businessDescription: String,
        // businessLicense: String,
        isApproved: {
            type: Boolean,
            default: false
        }
    },
    agentProfile: {
        employeeId: String,
        department: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    loginAttempts: {
        type: Number,
        default: 0,
        select: false
    },

    // Security fields
    verificationToken: String,
    verificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastPasswordChange: Date,
    passwordHistory: [{
        password: String,
        changedAt: Date
    }],

    // Social logins
    social: {
        google: {
            id: String,
            avatar: String
        },
        github: {
            id: String,
            avatar: String
        },
        facebook: {
            id: String,
            avatar: String
        }
    },

    // Metadata
    lastLogin: Date,
    lastIp: String,
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: {
            type: String,
            default: 'en'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: false
            },
            sms: {
                type: Boolean,
                default: false
            }
        }
    },

    addresses: { 
        type: [addressSchema], 
        default: [] 
    }, // Stores multiple addresses

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deactivatedAt: Date,
    lastProfileUpdate: Date
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});


// Add permission methods to user schema
userSchema.methods = {

    hasPermission: function(permission) {
        return hasPermission(this, permission);
    },

    hasAnyPermission: function(...permissions) {
        return hasAnyPermission(this, ...permissions);
    },

    hasAllPermissions: function(...permissions) {
        return hasAllPermissions(this, ...permissions);
    },

    getPermissions: function() {
        const rolePerms = this.roles.flatMap(role => getRolePermissions(role));
        return [...new Set([...rolePerms, ...this.permissions])];
    },

    addPermission: function(permission) {
    if (!this.permissions.includes(permission)) {
        this.permissions.push(permission);
    }
    return this;
    },

    removePermission: function(permission) {
        this.permissions = this.permissions.filter(p => p !== permission);
        return this;
    },

    addRole: function(role) {
        if (!this.roles.includes(role)) {
            this.roles.push(role);
        }
        return this;
    },

    removeRole: function(role) {
        this.roles = this.roles.filter(r => r !== role);
        return this;
    },

    upgradeToSeller: async function(sellerData) {
        this.addRole('seller');
        this.sellerProfile = sellerData;
        await this.save();
        return this;
    },

    // Special method for admin-created users
    createWithRole: async function(roleData) {
        if (roleData.role === 'seller') {
            return this.upgradeToSeller(roleData.sellerProfile);
        }
        if (roleData.role === 'agent') {
            this.addRole('agent');
            this.agentProfile = roleData.agentProfile;
        } else {
            this.addRole(roleData.role);
        }
        await this.save();
        return this;
    },

    approveRoleUpdate: async function () {
        this._adminApproved = true;
    },

    // Method to check password
    matchPassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    },

    // Method to generate JWT
    getSignedJwtToken: function() {
        return jwt.sign(
            { id: this._id, role: this.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    },

    // Method to generate refresh token
    getRefreshToken: function() {
        return jwt.sign(
            { id: this._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );
    },

    // Method to check if password changed after token was issued
    changedPasswordAfter: function (JWTTimestamp) {
        if (this.lastPasswordChange) {
            const changedTimestamp = parseInt(this.lastPasswordChange.getTime() / 1000, 10);
            return JWTTimestamp < changedTimestamp;
        }
        return false;
    }

};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    if (this.firstName && this.lastName) {
        return `${this.firstName} ${this.lastName}`;
    }
    return this.name;
});

// Middleware to update timestamps
userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.lastPasswordChange = new Date();
    }
    if (this.isModified('firstName') || this.isModified('lastName') || 
        this.isModified('email') || this.isModified('phone') || 
        this.isModified('avatar')) {
        this.lastProfileUpdate = new Date();
    }
    next();
});

// Virtual for full profile URL
userSchema.virtual('profileUrl').get(function() {
    return `${process.env.FRONTEND_URL}/profile/${this._id}`;
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = Date.now();
    next();
});

// Update timestamp on modification
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Prevent Unauthorized Role Updates
userSchema.pre("save", async function (next) {
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

// Pre-save hook for role validation
userSchema.pre('save', function(next) {
    // Prevent users from assigning themselves admin roles
    if (this.isModified('roles') && !this._adminApproved) {
        const newRoles = this.roles;
        const hadAdmin = this.roles.includes('admin') || this.roles.includes('super_admin');
        const hasAdmin = newRoles.includes('admin') || newRoles.includes('super_admin');

        if (!hadAdmin && hasAdmin) {
            throw new Error('Unauthorized role assignment');
        }
    }
    next();
});



// UserSchema.methods.approveRoleUpdate = function () {
//     this._adminApproved = true;
// };

// Method to check password
// userSchema.methods.matchPassword = async function(enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// Method to generate JWT
// userSchema.methods.getSignedJwtToken = function() {
//     return jwt.sign(
//         { id: this._id, role: this.role },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES_IN }
//     );
// };

// Method to generate refresh token
// userSchema.methods.getRefreshToken = function() {
//     return jwt.sign(
//         { id: this._id },
//         process.env.JWT_REFRESH_SECRET,
//         { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
//     );
// };

// Method to check if password changed after token was issued
// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//     if (this.lastPasswordChange) {
//         const changedTimestamp = parseInt(this.lastPasswordChange.getTime() / 1000, 10);
//         return JWTTimestamp < changedTimestamp;
//     }
//     return false;
// };

// Method to generate password reset token
// userSchema.methods.getResetPasswordToken = function() {
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     this.resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex');
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

//     return resetToken;
// };

// Static method to find by social ID
userSchema.statics.findBySocialId = async function(provider, id) {
    return this.findOne({ [`social.${provider}.id`]: id });
};

// Static method to check if user exists by contact
userSchema.statics.userExists = async function (contact) {
  const user = await this.findOne({ contact: contact });
  return !!user; // returns true if found, false otherwise
};

// Indexes
userSchema.index({ contact: 1 }, { unique: true });
userSchema.index({ 'social.google.id': 1 });
userSchema.index({ 'social.github.id': 1 });
userSchema.index({ isActive: 1, role: 1 });

export default mongoose.model('User', userSchema);
