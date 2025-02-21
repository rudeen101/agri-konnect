// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who added to wishlist
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Wishlisted product
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
