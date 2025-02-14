const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
        params: {
        folder: "uploads", // Cloudinary folder name
        allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowed file types
        public_id: (req, file) => `image-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    },
});

// Configure multer
const upload = multer({ storage });

module.exports = upload;
