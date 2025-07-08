import express from "express";
const router = express.Router();
import { getImage, uploadImage, deleteAllImages, deleteImageCloudinary } from "../controllers/image.controller.js";
import upload from "../middlewares/uploadImage.middleware.js";


router.get('/', getImage);

router.post('/upload', upload.array("images", 5), uploadImage);

// Delete images from database  
router.delete('/delete/all', deleteAllImages);

//Delete image from cloudinary
router.delete('/delete/cloudinary', deleteImageCloudinary);

export default router;