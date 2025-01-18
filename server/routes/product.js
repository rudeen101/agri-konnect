const  Category = require('../models/category');
const  Product = require('../models/product');
const {ImageUpload} = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { error } = require('console');

var imagesArray = [];

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
    const category = await Category.findById(req.body.category);
    if (!category) {
        return res.status(404).send("Invalid Category")
    }

    imagesArray = [];
    const uploadedImages = await ImageUpload.find();

    const images = uploadedImages?.map((item) => {
        item.images?.map((image) => {
            imagesArray.push(image);
            console.log(image);
        });
    });

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: imagesArray,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        subCatId: req.body.subCatId,
        catId: req.body.catId,
        catName: req.body.catName,
        subCat: req.body.subCat,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatired,
        discount: req.body.discount,
        // size: req.body.size,
        productWeight: req.body.productWeight,
        packagingType: req.body.packagingType,
        location: req.body.location !== "" ? req.body.location : "All",
    }); 


    product = await product.save();

    if(!product) {
        res.status(500).json({
            error: error,
            success: false
        });
    }

    imagesArray = []
    res.status(201).json(product);

}); 

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
        return res.status(404).json({
            message: "Page not found"
        })
    }

    let productList = [];

    if (req.query.minPrice !== undefined && req.query.maxPrice !== undefined){

        if (req.query.subCatId !== undefined && req.query.subCatId !== null && req.query.subCatId !== ""){
            
            if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                
                productList = await Product.find({
                    subCatId: req.query.subCatId,
                    location: req.query.location,
                }).populate({path: 'category', model: Category});
            } else{
                productList = await Product.find({
                    subCatId: req.query.subCatId,
                }).populate({path: 'category', model: Category});
            }
        }

        if (req.query.catId !== undefined && req.query.catId !== null && req.query.catId !== ""){
            
            if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                
                productList = await Product.find({
                    catId: req.query.catId,
                    location: req.query.location,
                }).populate({path: 'category', model: Category});
            } else{
                productList = await Product.find({
                    catId: req.query.catId,
                }).populate({path: 'category', model: Category});
            }
        }

        const filteredProducts = productList.filter(product => {
            if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
                return false;
            }
            if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
                return false;
            }
    
            return true;
        });
    
        if (!productList) {
            res.status(500).json({success:false})
        }
    
        return res.status(200).json({
            "products": filteredProducts,
            "totalPages": totalPages,
            "page": page
        });
    } 
    else if (req.query.page !== undefined && req.query.perPage !== undefined){
        if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
            productList = await Product.find({location: req.query.location}).populate({path: 'category', model: Category}).skip((page - 1) * perPage)
            .limit(perPage)
            .exec()
        }
        else{
            productList = await Product.find().populate({path: 'category', model: Category})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec()
        }

        if (!productList){
            res.status(500).json({success: false})
        }

        return res.status(200).json({
            "products": productList,
            "totalPages": totalPages,
            "page": page
        });

    }
    else {
        if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
            productList = await Product.find(req.query).populate({path: 'category', model: Category});
        }
        else if (req.query.category !== "" && req.query.cateogry !== null && req.query.category !== undefined){
            productList = await Product.find({catId: req.query.category}).populate({path: 'category', model: Category});
        }
        else if (req.query.catName !== "" && req.query.catName !== null && req.query.catName !== undefined){
            productList = await Product.find({catName: req.query.catName}).populate({path: 'category', model: Category});
        }
        else if (req.query.catId !== "" && req.query.catId !== null && req.query.catId !== undefined){
            productList = await Product.find({catId: req.query.catId}).populate({path: 'category', model: Category});
        }
        else if (req.query.subCatId !== "" && req.query.subCatId !== null && req.query.subCatId !== undefined){
            productList = await Product.find({subCatId: req.query.subCatId}).populate({path: 'category', model: Category});
        }

        if (req.query.rating !== "" && req.query.rating !== null && req.query.rating !== undefined){
            if (req.query.category !== "" && req.query.cateogry !== null && req.query.category !== undefined){
                if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                    productList = await Product.find({rating: req.query.rating, catId: req.query.category, location: req.query.location}).populate({path: 'category', model: Category});
                }
                else {
                    productList = await Product.find({rating: req.query.rating, catId: req.query.category}).populate({path: 'category', model: Category});
                }
            }
        }

        if (req.query.rating !== "" && req.query.rating !== null && req.query.rating !== undefined){
            if (req.query.subCatId !== "" && req.query.subCatId !== null && req.query.subCatId !== undefined){
                if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                    productList = await Product.find({rating: req.query.rating, subCatId: req.query.subCatId, location: req.query.location}).populate({path: 'category', model: Category});
                }
                else {
                    productList = await Product.find({rating: req.query.rating, subCatId: req.query.subCatId}).populate({path: 'category', model: Category});
                }
            }
        }

        if (!productList){
            res.status(500).json({success: false})
        }

        return res.status(200).json({
            "products": productList,
            "totalPages": totalPages,
            "page": page
        });

    }


    

})

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).json({
            success: false
        });
    }
    else{
        res.send({
            productCount: productCount,
        });
    }

});

router.get('/featured', async (req, res) => {
    let productList = "";

    if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
        productList = await Product.find({isFeatured: true, location: req.query.location})
    }
    else{
        productList = await Product.find({"isFeatured": true});
    }

    if (!productList){
        res.status(500).json({success: false})
    }

    return res.setMaxListeners(200).json(productList)
});

router.get('/:id', async (req, res) => {

    const product = await Product.findById(req.params.id).populate({path: 'category', model: Category});

    if (!product) {
        res.status(500).json({
            message: "The product with the given id was not found."
        });
    }
    
    return res.status(200).send(product);

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

    const product = await Product.findById(req.params.id);
    const images = product.images;

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

    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
        res.status(404).json({
            message: "Product not found!",
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: "Product Deleteed!"
    })
});

router.put("/:id", async(req, res) => {
    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: imagesArray,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            subCatId: req.body.subCatId,
            catId: req.body.catId,
            catName: req.body.catName,
            subCat: req.body.subCat,
            category: req.body.name,
            countInStock: req.body.countInStock,
            rating: req.body.reting,
            isFeatured: req.body.isFeatired,
            discount: req.body.discount,
            size: req.body.size,
            productWeight: req.body.productWeight,
            location: req.body.location !== "" ? req.body.location : "All",
        },
        {new: true}
    );

    if (!product) {
        return res.status(500).json({
            message: "Product cannot not be updated!",
            success: false
        });
    }

    imagesArr = [];
    res.send(product); 
});

router.get('/category/:id', async (req, res) => {

    const product = await Product.findById(req.params.id).populate({path: 'category', model: Category});

    if (!product) {
        res.status(500).json({
            message: "The product with the given category id was not found."
        });
    }
    
    return res.status(200).send(product);

});














// const createCategories = (categories, parentId=null) => {
//     const categoryList = [];

//     let category;
//     if (parentId == null) {
//         category = categories.filter((cat) => cat.parentId == undefined);
//     }
//     else{
//         category = categories.filter((cat) => cat.parentId == parentId);
//     }

//     for (let cat of category){
//         categoryList.push({
//             _id: cat.id,
//             name: cat.name,
//             images: cat.images,
//             colo: cat.color,
//             slug: cat.slug,
//             children: createCategories(categories, cat._id)
//         })
//     }

//     return categoryList;
// }

// router.get('/subCat/get/count', async (req, res) => {
//     const category = await Category.find()

//     if (!category) {
//         res.status(500).json({
//             success: false
//         });
//     }
//     else{
//         const subCatList = [];
//         for (cat of category) {
//             if (cat.parentId !== undefined) {
//                 subCatList.push(cat);
//             }
//         }

//         res.send({
//             categoryCount: subCatList.length,
//         });
//     }

// });

// router.get('/:id', async (req, res) => {
//     const categoryId = req.params.id;

//     const category = await Category.findById(categoryId)

//     if (!category) {
//         res.status(500).json({
//             message: "The category wit the given id was not found."
//         });
//     }
    
//     return res.status(200).send(category);

// });







module.exports = router;