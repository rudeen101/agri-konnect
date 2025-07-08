import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import rateLimiter from "./config/rateLimit.js"
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// import helmet = require('helmet');
// import morgan = require('morgan');
// import connectDB = require('./config/db');
// import rateLimiter = require('./config/rateLimit');
// import errorHandler = require('./middleware/errorHandler');
// import cors = require('cors');
// import cookieParser cookie-parser;

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Use Helmet for security headers
app.use(helmet());

app.use(cors());
app.options('*', cors());

// Logging middleware
// app.use(morgan('combined'));

// Rate limiting
// app.use(rateLimiter);

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  // Add your production domains when ready
];

app.use(cors({
  origin: (origin, callback) => {
    console.log('Incoming Origin:', origin); // Log it for debug

    // Allow requests without origin (e.g., Postman, proxy)
    if (!origin) {
      return callback(null, true);
    }

    // Match origin against the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }

    // Reject if not allowed
    return callback(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));
app.options('*', cors()); // Enable preflight for all routes


app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware
// app.use(bodyParser.json())
// app.use(express.json());


// import bodyParser = require('body-parser');
// import mongoose = require('mongoose');
// require('dotenv/config');

//Routes
import categoryRoutes from "./routes/category.js";
import imageUploadRoutes from  "./routes/imageUpload.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/users.js";
import homeSliderBannerRoutes from "./routes/homeSliderBanner.js";
import cartRoutes from "./routes/cart.js";
import productReviewsRoutes from "./routes/productReviews.js";
import bannerRoutes from "./routes/banner.js";
import wishListRoutes from "./routes/wishList.js";
import searchRoutes from "./routes/search.js";
import tagRoutes from "./routes/tag.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/order.js";
import dashboardStatsRoutes from "./routes/dashboardStats.js";
import salesRoutes from "./routes/sales.js";
import sellerRoutes from "./routes/seller.js";
import newsletterRoutes from "./routes/newsletter.js"

app.use("/upoads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/product`, productRoutes);
app.use(`/api/user`, userRoutes);
app.use(`/api/homeSliderBanner`, homeSliderBannerRoutes);
app.use(`/api/cart`, cartRoutes);
app.use(`/api/productReviews`, productReviewsRoutes);
app.use(`/api/banner`, bannerRoutes);
app.use(`/api/wishlist`, wishListRoutes);
app.use(`/api/search`, searchRoutes);
app.use(`/api/tag`, tagRoutes);
app.use(`/api/auth`, authRoutes);
app.use(`/api/admin`, adminRoutes);
app.use(`/api/order`, orderRoutes);
app.use(`/api/dashboard`, dashboardStatsRoutes);
app.use(`/api/sales`, salesRoutes);
app.use(`/api/seller`, sellerRoutes);
app.use(`/api/newsletter`, newsletterRoutes);

// Global Error Handler
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});