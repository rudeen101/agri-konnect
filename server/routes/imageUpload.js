const express = require("express");
const router = express.Router();
const { ImageUpload } = require('../models/imageUpload')

router.get('/', async (req, res) => {

    try {
        const imageUploadList = await ImageUpload.find();

        console.log(imageUploadList);

        if (!imageUploadList) {
            res.status(500).json({success: false})
        }

        return res.status(200).json(imageUploadList)
    } catch (error) {
        console.log(error);
    }

});

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

module.exports = router;