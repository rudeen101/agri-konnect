const  HomeSliderBanner = require('../models/homeSliderBanner');
const express = require("express");
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');

const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: process.env.cloudinary_config_cloud_name,
    api_key: process.env.cloudinary_config_api_key,
    api_secret: process.env.cloudinary_config_api_secret,
    secure: true
});


// // router.post('/homeBanner', upload.array("images"), async (req, res) => {

// //     imagesArr = [];

// //     try {
        
// //         for (let i = 0; i < req?.files?.length; i++) {
// //             const options =  {
// //                 use_filename: true,
// //                 unique_filename: false,
// //                 overwrite: false
// //             }
        
// //             const imagesUpload = await cloudinary.uploader.upload(
// //                 req.files[i].path,
// //                 options,
// //                 function (error, result) {
// //                     console.log(result)
// //                     imagesArr.push(result.secure_url);
// //                     console.log(`uploads/${req.files[i].filename}`)
// //                     fs.unlinkSync(`uploads/${req.files[i].filename}`);
// //                 }
// //             );

// //             let imagesUploaded = new HomeSliderBanner({
// //                 images: imagesArr
// //             });

// //             imagesUploaded = await imagesUploaded.save();
// //             return res.status(200).json(imagesArr);
// //         }
// //     } catch (error) {
// //         console.log(error);
// //     }

// // }); 

// // router.get('/', async (req, res) => {
// //     try {
// //         const homeBannerList = await HomeSliderBanner.find();

// //         if (!homeBannerList) {
// //             res.status(500).json({success: false})
// //         }

// //         res.status(200).json({success: true, data: homeBannerList})

// //     } catch (error) {
// //         console.log(error)

// //         res.status(500).json({success: false, error: error});
// //     }
// // });

// router.get('/:id', async (req, res) => {
//     const homeBannerId = req.params.id;

//     const banner = await HomeSliderBanner.findById(homeBannerId);
//     if (!banner) {
//         res.status(500).json({success: false, msg: "Banner with given id not found!"});
//     }

//     res.status(200).send(banner);
// });

// router.post('/create', async (req, res) => {
//     imagesArr = req.body.images;
//     let newBanner = new HomeSliderBanner({
//         images: imagesArr
//     });

//     if (!newBanner) {
//         res.status(500).json({
//             error: error,
//             success: false
//         })
//     }

//     newBanner = await newBanner.save();

//     imagesArr = [];

//     res.status(200).json(newBanner);
// });   




// router.delete('/:id', async (req, res) => {
//     const banner = await HomeSliderBanner.findById(req.params.id);

//     const images = banner.images;

//     for (img of images) {
//         console.log(imgUrl);

//         const urlArray = imgUrl.split('/');
//         const image = urlArray[urlArray.length-1];

//         const imageName = image.split(".")[0];

//         cloudinary.uploader.distory(imageName, (error, result) => {
//             console.log(error)
//         });
//     }

//     const deletedBanner = await HomeSliderBanner.findByIdAndDelete(req.params.id);
//     console.log(deletedBanner)

//     if (!deletedBanner) {
//         res.status(404).json({
//             msg: "Banner not found",
//             success: false
//         });
//     }

//     res.status(200).json({
//         msg: "Banner deleted successfully",
//         success: false
//     });
    

// });


// router.put('/:id', async (req, res) => {

//     const banner = await HomeSliderBanner.findByIdAndUpdate(req.params.id, 
//         {
//             images: req.body.images,
//         },
//         {new: true}
//     )

//     if (!banner) {
//         return res.status(500).json({
//             msg: "Banner cannot be updated!",
//             success: false
//         })
//     }

//     imagesArr = [];

//     res.status(200).send(banner);
// });

// module.exports = router;


/**
 * GET /api/homeSliderBanner
 * Returns active banners for the home page.
 * Optionally, filtering by scheduling fields (startDate, endDate) can be applied.
 */
router.get('/', async (req, res) => {
    try {
        // For a simple implementation, return all banners.
        // To implement scheduling, uncomment and adjust the following filter:
        //
        // const now = new Date();
        // const banners = await Banner.find({
        //   $or: [
        //     { startDate: { $exists: false } },
        //     { startDate: { $lte: now } }
        //   ],
        //   $or: [
        //     { endDate: { $exists: false } },
        //     { endDate: { $gte: now } }
        //   ]
        // }).lean();
        const homeSliderBanner = await HomeSliderBanner.find();
        res.json({ homeSliderBanner });
    } catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

router.get('/:id',  async (req, res) => {

    try {
        const bannerId = req.params.id;

        const homeSliderBanner = await HomeSliderBanner.findById(bannerId);
      
        return res.status(200).send(homeSliderBanner);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to Home Slider Banner' });
    }

});

/**
 * POST /api/homeSliderBanner
 * Creates a new banner.
 * Protected route: Only admin can create banners.
 */
router.post('/create', verifyToken, authorize('admin'), async (req, res) => {
    try {
        const newBanner = new HomeSliderBanner(req.body);
        await newBanner.save();

        res.status(201).json({ message: 'Banner created successfully', homeSliderBanner: newBanner });
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ error: 'Failed to create banner' });
    }
});

/**
 * PUT /api/homeSliderBanner/:bannerId
 * Updates an existing banner.
 * Protected route: Only admin can update banners.
 */
router.put('/:bannerId', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const updatedBanner = await HomeSliderBanner.findByIdAndUpdate(
        req.params.bannerId, 
        req.body, 
        { new: true, runValidators: true }
    );

    if (!updatedBanner) return res.status(404).json({ error: 'Banner not found' });

    res.json({ message: 'Banner updated successfully', homeSliderBanner: updatedBanner });

  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

/**
 * DELETE /api/homeSliderBanner/:bannerId
 * Deletes a banner.
 * Protected route: Only admin can delete banners.
 */
router.delete('/:id', verifyToken, authorize('admin'), async (req, res) => {
    try {
        const deletedBanner = await HomeSliderBanner.findByIdAndDelete(req.params.id);

        if (!deletedBanner) return res.status(404).json({ error: 'Banner not found' });

        res.json({ message: 'Banner deleted successfully' });

    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({ error: 'Failed to delete banner' });
    }
});

/**
 * DELETE /api/banner/deleteImage
 * Deletes a banner image.
 * Protected route: Only admin can delete banners.
 */
router.delete('/deleteImage', verifyToken, authorize('admin'), async (req, res) => {


    try {
        const imgUrl = req.query.img;

        const urlArray = imgUrl.split('/');
        const image = urlArray[urlArray.length-1];
    
        const imageName = image.split(".")[0];
    
        const result = await cloudinary.uploader.destroy(imageName, (error, result) => {
            console.log(error)
        });
    
        if (result) {
            res.status(201).send(result);
        }

    } catch (error) {
        console.error("Error deleting banner image:", error);
        res.status(500).json({ error: 'Failed to delete banner image' });
    }
}); 

module.exports = router;




