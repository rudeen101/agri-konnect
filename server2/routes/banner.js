import  Banner  from '../models/banner.js';
import express from "express";
const router = express.Router();
import cloudinary from "../config/cloudinaryConfig.js";

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

    let newBanner = new Banner({
        images: req.body.images,
        name: req.body.name,
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
    res.status(200).json(newBanner);
});   

router.delete('/:id', async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    const images = banner.images;

    for (const imgUrl of images) {

        // Extract public_id from URL (more robust method)
        const publicId = imgUrl.split('/').slice(-2)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
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
            name: req.body.name,
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
  
    res.status(200).send(banner);
});

export default router;



