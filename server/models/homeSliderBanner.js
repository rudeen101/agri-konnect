// models/Banner.js
const mongoose = require('mongoose');

const homeSliderBannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  alt: { type: String },
  title: { type: String, required: true },
  subtitle: { type: String },
  ctaText: { type: String },
  ctaUrl: { type: String },
  // Optionally, add scheduling fields:
  startDate: { type: Date },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HomeSliderBannerSchema', homeSliderBannerSchema);
