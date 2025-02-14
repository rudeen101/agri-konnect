// models/Seller.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeName: { type: String, required: true },
  description: String,
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
});

module.exports = mongoose.model('Seller', sellerSchema);
