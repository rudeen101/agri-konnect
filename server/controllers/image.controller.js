import ImageUpload  from '../models/ImageUpload.model.js';
import fs from "fs"
import cloudinary from "../config/cloudinary.js";
import { ObjectId } from 'mongodb'; 


export const getImage = async (req, res) => {

    try {
        const imageUploadList = await ImageUpload.find();

        if (!imageUploadList) {
            res.status(500).json({success: false})
        }

        return res.status(200).json(imageUploadList)
    } catch (error) {
        console.log(error);
    }

};

export const uploadImage = async (req, res) => {

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
            return res.status(200).json({success: true, images: imagesArr});
        }
    } catch (error) {
        console.log(error);
    }

}; 


// // Delete images from database  
export const deleteAllImages = async (req, res) => {

    const images = await ImageUpload.find()
    let deleteImage;

    if (images.length !== 0){
        for (const image of images) {
            deleteImage = await ImageUpload.findByIdAndDelete({ _id: new ObjectId(image._id) })
        }
    }

    res.json(deleteImage);
};


// //Delete image from cloudinary
export const deleteImageCloudinary = async (req, res) => {
const imageUrl = req.query.img;

// Extract public_id from URL (more robust method)
const publicId = extractCloudinaryPublicId(imageUrl);

try {
  const response = await cloudinary.uploader.destroy(publicId);
    if (response.result !== 'ok') {
        return res.status(400).json({ success: false, message: 'Failed to delete image from Cloudinary' });
    }
    // Delete the image record from your database
    await ImageUpload.updateMany(
        { images: imageUrl },
        { $pull: { images: imageUrl } }
    );
    // await ImageUpload.deleteOne({ images: imageUrl });


    res.status(200).json({ success: true, message: 'Image deleted successfully', data: response });
} catch (error) {
  console.error('Cloudinary deletion error:', error);
  res.status(500).json({ success: false, message: 'Failed to delete image' });
}

};


function extractCloudinaryPublicId(imageUrl) {
  // Remove query params/fragments if present
  const cleanUrl = imageUrl.split('?')[0].split('#')[0];
  // Get the part after '/upload/'
  const parts = cleanUrl.split('/upload/');
  if (parts.length < 2) return null;
  // Remove version if present (e.g., v123456789/)
  const afterUpload = parts[1].replace(/^v\d+\//, '');
  // Remove file extension
  const publicId = afterUpload.replace(/\.[^/.]+$/, '');
  return publicId;
}

// export default router;