import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link seller to a user
    businessName: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    businessType: { type: String, required: true },
    products: { type: [String], required: true }, // List of product categories
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Approved" },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
