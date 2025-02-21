const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderItems: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                images:[
                    {
                        type: String,
                        required: true
                    }
                ],
            },
        ],
        deliveryAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true, default: "Liberia" },
            pickupStation: { type: String, default: "" },
        },

        paymentDetails: {
            method: {
              type: String,
              enum: ["MoMo", "OrangeMoney", "Cash"],
              required: true,
            },
            accountName: { type: String }, // Optional, for digital payments
            accountPhone: { type: String }, // Optional, for digital payments
        },
        totalPrice: { type: Number, required: true },
        paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
        status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
        deliveredAt: { type: Date },
        createdAt: { type: Date, default: Date.now },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);



