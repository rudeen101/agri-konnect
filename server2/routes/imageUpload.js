import express from "express";
const router = express.Router();
import ImageUpload  from '../models/imageUpload.js';
import fs from "fs"
import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { ObjectId } from 'mongodb'; // or 'mongoose'


router.get('/', async (req, res) => {

    try {
        const imageUploadList = await ImageUpload.find();

        if (!imageUploadList) {
            res.status(500).json({success: false})
        }

        return res.status(200).json(imageUploadList)
    } catch (error) {
        console.log(error);
    }

});

router.post('/upload', upload.array("images", 5), async (req, res) => {

    var imagesArr = [];

    try {
        for (let i = 0; i < req?.files?.length; i++) {
            const options =  {
                use_filename: true,
                unique_filename: false,
                overwrite: false
            }
        
            await cloudinary.uploader.upload(
                req.files[i].path,
                options,
                function (error, result) {
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${req.files[i].filename}`);
                }
            );

            let imagesUploaded = new ImageUpload({
                images: imagesArr
            });

            imagesUploaded = await imagesUploaded.save();
            return res.status(200).json(imagesArr);
        }
    } catch (error) {
        console.log(error);
    }

}); 


// Delete images from database  
router.delete('/deleteAllImages', async (req, res) => {

    const images = await ImageUpload.find()
    let deleteImage;

    if (images.length !== 0){
        for (const image of images) {
            deleteImage = await ImageUpload.findByIdAndDelete({ _id: new ObjectId(image._id) })
        }
    }

    res.json(deleteImage);
});

//Delete image from cloudinary
router.delete('/deleteImage', async (req, res) => {
const imageUrl = req.query.img;

// Extract public_id from URL (more robust method)
const publicId = imageUrl.split('/').slice(-2)[0].split('.')[0];

try {
  const response = await cloudinary.uploader.destroy(publicId);
  res.status(200).json(response);
} catch (error) {
  console.error('Cloudinary deletion error:', error);
  res.status(500).json({ error: 'Failed to delete image' });
}

});

export default router;