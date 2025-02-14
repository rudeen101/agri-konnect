const  Category = require('../models/category')
const {ImageUpload} = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const multer = require("multer");
const fs = require("fs");

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



router.post('/upload', upload.array("images"), async (req, res) => {

    var imagesArr = [];

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
                    console.log(result)
                    imagesArr.push(result.secure_url);
                    console.log(`uploads/${req.files[i].filename}`)
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
 
router.post('/create', async (req, res) => {
    let catObj = {};
    imagesArr = req.body.images;

    if (imagesArr.length > 0) {
        catObj = {
            name: req.body.name,
            images: imagesArr,
            color: req.body.color,
            slug: req.body.slug,
        }
    }
    else{
        catObj = {
            name: req.body.name,
            slug: req.body.slug,
            color: req.body.color
        }
    }

    if (req.body.parentId){
        catObj.parentId = req.body.parentId;
    }

    let category = new Category(catObj);

    if (!category) {
        req.statusCode(500).json({
            error: err,
            success: false
        })
    }

    category = await category.save();
    imagesArr = [];

    res.status(201).json(category);
}); 

const createCategories = (categories, parentId=null) => {
    const categoryList = [];

    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    }
    else{
        category = categories.filter((cat) => cat.parentId == parentId);
    }

    for (let cat of category){
        categoryList.push({
            _id: cat.id,
            name: cat.name,
            images: cat.images,
            colo: cat.color,
            slug: cat.slug,
            children: createCategories(categories, cat._id)
        })
    }

    return categoryList;
}

router.get('/', async (req, res) => {
    try {
        console.log(Category);

        const categoryList = await Category.find();

        if (!categoryList) {

            res.status(500).json({
                success: false
            })
        }

        if (categoryList){
            const categoryData = createCategories(categoryList);

            return res.status(200).json({
                categoryList: categoryData
            });
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/get/count', async (req, res) => {
    const categoryCount = await Category.countDocuments({
        parentId: undefined
    });

    if (!categoryCount) {
        res.status(500).json({
            success: false
        });
    }
    else{
        res.send({
            categoryCount: categoryCount,
        });
    }

});

router.get('/subCat/get/count', async (req, res) => {
    const category = await Category.find()

    if (!category) {
        res.status(500).json({
            success: false
        });
    }
    else{
        const subCatList = [];
        for (cat of category) {
            if (cat.parentId !== undefined) {
                subCatList.push(cat);
            }
        }

        res.send({
            categoryCount: subCatList.length,
        });
    }

});

router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId)

    if (!category) {
        res.status(500).json({
            message: "The category wit the given id was not found."
        });
    }
    
    return res.status(200).send(category);

});

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

router.delete('/:id', async (req, res) => {

    const category = await Category.findById(req.params.id);
    const images = category.images;

    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split('.')[0];

        if (imageName) {
            cloudinary.uploader.destroy(
                imageName,
                (error, result) => {
                    // console.log(result);
                }
            )
        }
    }

    const deleteCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deleteCategory) {
        res.status(404).json({
            message: "Category not found!",
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: "Category Deleteed!"
    })
    // }
});

router.put("/:id", async(req, res) => {
    
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            images: req.body.images,
            color: req.body.color
        },
        {new: true}
    );

    if (!category) {
        return res.status(500).json({
            message: "Category cannot not be updated!",
            success: false
        });
    }

    imagesArr = [];
    res.send(category); 
});

module.exports = router;