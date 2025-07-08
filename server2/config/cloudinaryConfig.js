import cloudinaryPackage from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const { v2: cloudinary } = cloudinaryPackage;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// const { v2: cloudinary } = require("cloudinary");
// require("dotenv").config();

// // Configure Cloudinary with API credentials
// cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;
