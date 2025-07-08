import cloudinaryPackage from 'cloudinary';
import { CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_NAME  } from './environment.js';

// dotenv.config(); // Load .env variables

const { v2: cloudinary } = cloudinaryPackage;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

export default cloudinary;