const express = require("express");
const router = express.Router();
const { ImageUpload } = require('../models/imageUpload');
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/uploadMiddleware");


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
        for (image of images) {
            deleteImage = await ImageUpload.findByIdAndDelete(image.id)
        }
    }

    res.json(deleteImage);
});

//Delete image from cloudinary
router.delete('/deleteImage', async (req, res) => {
    const imageUrl = req.query.img;
    const urlArr = imageUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    const response = await cloudinary.uploader.destroy(
        imageName,
        (error, result) => {
            // console.log(result);
        }
    )

    if (response){
        res.status(200).send(response);
    }

});

// router.delete('/:id', async (req, res) => {

//     deleteImage = await ImageUpload.findByIdAndDelete(req.params.id)

//     res.json(deleteImage);
// });

// export const deleteImage = async (req, res) => {
//     try {
//         const { public_id } = req.body;
//         if (!public_id) return res.status(400).json({ error: "Missing public_id" });

//         await cloudinary.uploader.destroy(public_id);
//         res.json({ message: "Image deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to delete image" });
//     }
// };

module.exports = router;