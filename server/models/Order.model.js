import mongoose from 'mongoose';
import UserModel from './User.model.js';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    // variant: {
    //     type: mongoose.Schema.Types.ObjectId
    // },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be positive']
    },
    discount: {
        type: Number,
        default: 0
    },
    // taxRate: {
    //     type: Number,
    //     default: 0
    // },
       images: [{
        url: String,
    }],
    // sku: String
}, { _id: false });

const paymentResultSchema = new mongoose.Schema({
    id: String,
    status: String,
    update_time: String,
    email_address: String
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
    accountName: String,
    phoneNumber: String,
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  address: String,
  city: String,
  county: String,
  country: {
    type: String,
    default: "Liberia"
  },
  isBusiness: Boolean,
  businessName: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentDetails: paymentDetailsSchema,
  paymentMethod: {
    type: String,
    required: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingMethod: {
    type: String,
    required: true,
    default: "Standard"
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  trackingNumber: String,
  carrier: String,
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for order ID
orderSchema.virtual('orderNumber').get(function() {
  if (!this._id) return 'ORD-N/A';
  return `ORD-${this._id.toString().substring(18, 24).toUpperCase()}`;
});

// Virtual for estimated delivery date
orderSchema.virtual('estimatedDelivery').get(function() {
    const date = new Date(this.createdAt);
    date.setDate(date.getDate() + 7); // 7 days from order date
    return date;
});

// Pre-save hook to calculate prices
orderSchema.pre('save', function(next) {
  try {
    this.itemsPrice = this.orderItems.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );
    
    this.totalPrice = (
      this.itemsPrice +
      this.shippingPrice -
      this.discountAmount
    ).toFixed(2);
    
    next();
  } catch (err) {
    next(err);
  }
});

// Static method to get orders by user
orderSchema.statics.findByUser = function(userId) {
    return this.find({ user: userId }).sort('-createdAt');
};

// Static method for order statistics
orderSchema.statics.getOrderStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: '$totalPrice' },
                avgOrderValue: { $avg: '$totalPrice' },
                minOrder: { $min: '$totalPrice' },
                maxOrder: { $max: '$totalPrice' }
            }
        },
        {
            $project: {
                _id: 0,
                numOrders: 1,
                totalSales: 1,
                avgOrderValue: { $round: ['$avgOrderValue', 2] },
                minOrder: 1,
                maxOrder: 1
            }
        }
    ]);

    return stats[0] || {};
};

orderSchema.statics.getOrderStats = async function() {
  try {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: '$totalPrice' },
                avgOrderValue: { $avg: '$totalPrice' },
                minOrder: { $min: '$totalPrice' },
                maxOrder: { $max: '$totalPrice' }
            }
        },
        {
            $project: {
                _id: 0,
                numOrders: 1,
                totalSales: 1,
                avgOrderValue: { $round: ['$avgOrderValue', 2] },
                minOrder: 1,
                maxOrder: 1
            }
        }
    ]);
    return stats[0] || {};
  } catch (err) {
    console.error('Order stats error:', err);
    return {
      numOrders: 0,
      totalSales: 0,
      avgOrderValue: 0,
      minOrder: 0,
      maxOrder: 0
    };
  }
};

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'orderItems.product': 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);