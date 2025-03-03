
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true }, // Main order number
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who placed the order
    totalPrice: { type: Number, required: true }, // Total of all sub-orders
    pickupStation: { type: String }, 
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "received"], default: "pending" },
    deliveredAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const SubOrderSchema = new mongoose.Schema({
    mainOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Link to main order
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who is receiving the order
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, // Who placed the order

    isReceived: { type: Boolean, default: false }, // Whether the receiver has confirmed receipt
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            images:[
                {
                    type: String,
                    required: true
                }
            ],
            status: { type: String, required: true, default: "pending" },
            seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        }
    ],
    paymentDetails: {
        method: {
          type: String,
          enum: ["MoMo", "OrangeMoney", "Cash"],
          required: true,
        },
        accountName: { type: String }, // Optional, for digital payments
        accountPhone: { type: String }, // Optional, for digital payments
    },
    deliveryAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true, default: "Liberia" },
        pickupStation: { type: String, default: "" },
    },

    subTotal: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "processing", "delivered", "received", "completed", "cancelled"], default: "pending" },
    trackingNumber: { type: String, unique: true },
    deliveredAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);
const SubOrder = mongoose.model("SubOrder", SubOrderSchema);

module.exports = { Order, SubOrder };



