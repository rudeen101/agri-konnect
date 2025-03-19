const  Banner = require('../models/banner');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { error } = require('console');

var imagesArr = [];

const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: process.env.cloudinary_config_cloud_name,
    api_key: process.env.cloudinary_config_api_key,
    api_secret: process.env.cloudinary_config_api_secret,
    secure: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
})

const upload = multer({ storage: storage })


router.post('/banner', upload.array("images"), async (req, res) => {

    imagesArr = [];

    try {
        
        for (let i = 0; i < req?.files?.length; i++) {
            const options =  {
                use_filename: true,
                unique_filename: false,
                overwrite: false
            }
        
            const imagesUpload = await cloudinary.uploader.upload(
                req.files[i].path,
                options,
                function (error, result) {
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${req.files[i].filename}`);
                }
            );

            let imagesUploaded = new HomeSliderBanner({
                images: imagesArr
            });

            imagesUploaded = await imagesUploaded.save();
            return res.status(200).json(imagesArr);
        }
    } catch (error) {
        console.log(error);
    }

}); 

router.get('/', async (req, res) => {
    try {
        const banner = await Banner.find();

        if (!banner) {
            res.status(500).json({success: false})
        }

        res.status(200).json({success: true, data: banner})

    } catch (error) {
        console.log(error)

        res.status(500).json({success: false, error: error});
    }
});

router.get('/:id', async (req, res) => {
    const bannerId = req.params.id;

    const banner = await Banner.findById(bannerId);
    if (!banner) {
        res.status(500).json({success: false, msg: "Banner with given id not found!"});
    }

    res.status(200).send(banner);
});

router.post('/create', async (req, res) => {
    imagesArr = req.body.images;
    let newBanner = new Banner({
        images: imagesArr,
        catId: req.body.catId,
        catName: req.body.catName,
        subCatId: req.body.subCatId,
        subCatName: req.body.subCatName,
    });

    if (!newBanner) {
        res.status(500).json({
            error: error,
            success: false
        })
    }

    newBanner = await newBanner.save();

    imagesArr = [];

    res.status(200).json(newBanner);
});   


router.delete('/deleteImage', async (req, res) => {
    const imgUrl = req.query.img;

    const urlArray = imgUrl.split('/');
    const image = urlArray[urlArray.length-1];

    const imageName = image.split(".")[0];

    const result = await cloudinary.uploader.destroy(imageName, (error, result) => {
        console.log(error)
    });

    if (result) {
        res.status(200).send(result);
    }
}); 

router.delete('/:id', async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    const images = banner.images;

    for (imgUrl of images) {
        const urlArray = imgUrl.split('/');
        const image = urlArray[urlArray.length-1];

        const imageName = image.split(".")[0];

        cloudinary.uploader.destroy(imageName, (error, result) => {
            console.log(error)
        });
    }

    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
        res.status(404).json({
            msg: "Banner not found",
            success: false
        });
    }

    res.status(200).json({
        msg: "Banner deleted successfully",
        success: false
    });
});


router.put('/:id', async (req, res) => {

    const banner = await Banner.findByIdAndUpdate(
        req.params.id, 
        {
            images: req.body.images,
            catId: req.body.catId,
            catName: req.body.catName,
            subCatId: req.body.subCatId,
            subCatName: req.body.subCatName,   
        },
        {new: true}
    )

    if (!banner) {
        return res.status(500).json({
            msg: "Banner cannot be updated!",
            success: false
        })
    }
  
    imagesArr = [];
    res.status(200).send(banner);
});

module.exports = router;



