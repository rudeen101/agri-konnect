require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const rateLimiter = require('./config/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();
PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Use Helmet for security headers
app.use(helmet());

// Configure CORS for production
// app.use(cors({
//     origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : '*',
//     credentials: true,
// }));

app.use(cors());
app.options('*', cors());

// Logging middleware
// app.use(morgan('combined'));

// Rate limiting
// app.use(rateLimiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware
// app.use(bodyParser.json())
// app.use(express.json());


// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// require('dotenv/config');

//Routes
const categoryRoutes = require("./routes/category");
const imageUploadRoutes = require("./routes/imageUpload");
// const imageUploadRoutes = require('./helper/imageUpload.js')
// const prouductWeightRoutes = require('./routes/productWeight.js')
// const prouductSizeRoutes = require('./routes/productSize.js')
const productRoutes = require('./routes/product.js');
const userRoutes = require("./routes/users.js");
const homeSliderBannerRoutes = require("./routes/homeSliderBanner.js");
const cartRoutes = require("./routes/cart.js");
const productReviewsRoutes = require("./routes/productReviews.js");
const bannerRoutes = require("./routes/banner.js");
const wishListRoutes = require("./routes/wishList.js");
const searchRoutes = require("./routes/search.js");
const tagRoutes = require("./routes/tag.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");

app.use("/upoads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/product`, productRoutes);
app.use(`/api/user`, userRoutes);
app.use(`/api/homeSliderBanner`, homeSliderBannerRoutes);
app.use(`/api/cart`, cartRoutes);
app.use(`/api/productReviews`, productReviewsRoutes);
app.use(`/api/banner`, bannerRoutes);
app.use(`/api/wishList`, wishListRoutes);
app.use(`/api/search`, searchRoutes);
app.use(`/api/tag`, tagRoutes);
app.use(`/api/auth`, authRoutes);
app.use(`/api/admin`, adminRoutes);
// app.use(`/api/productWeight`, prouductWeightRoutes);
// app.use(`/api/productSize`, prouductSizeRoutes);

// Global Error Handler
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});