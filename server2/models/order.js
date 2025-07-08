
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true }, // Main order number
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who is receiving the order
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, // Who placed the order
    isReceived: { type: Boolean, default: false }, // Whether the receiver has confirmed receipt
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            category: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            images:[
                {
                    type: String,
                    required: true
                }
            ],
            estimatedDeliveryDate: { type: Number, default: 0 },
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
    totalPrice: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    status: { type: String, enum: ["pending confirmation", "accept", "reject", "completed"], default: "pending confirmation" },
    tracking: { type: String, enum: ["pending tracking", "processing", "in-route", "delivered", "received"], default: "pending tracking" },
    paymentStatus: { type: String, enum: ["pending", "paid", "refund"], default: "pending" },
    trackingNumber: { type: String, unique: true },
    deliveredAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);
// const SubOrder = mongoose.model("SubOrder", SubOrderSchema);

export default Order;
// export default { Order, SubOrder };



