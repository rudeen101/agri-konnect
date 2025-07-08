import express from "express";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";


router.get('/', getImage);

router.post('/upload', upload.array("images", 5), uploadImage);

// Delete images from database  
router.delete('/deleteAllImages', deleteAllImages);

//Delete image from cloudinary
router.delete('/deleteImage', deleteImageCloudinary);

export default router;