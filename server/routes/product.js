const  Category = require('../models/category');
const  User = require('../models/users');
const  Product = require('../models/product');
const  Tag = require('../models/tag');
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
        tags: req.body.tags,
        seller: req.body.sellerId,
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
                }).
                    populate({path: 'category', model: Category}).
                    populate({path: 'tags', model: Tag});
                    
            } else{
                productList = await Product.find({
                    subCatId: req.query.subCatId,
                }).
                    populate({path: 'category', model: Category}).
                    populate({path: 'tags', model: Tag});
            }
        }

        if (req.query.catId !== undefined && req.query.catId !== null && req.query.catId !== ""){
            
            if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                
                productList = await Product.find({
                    catId: req.query.catId,
                    location: req.query.location,
                }).
                    populate({path: 'category', model: Category}).
                    populate({path: 'tags', model: Tag});
            } else{
                productList = await Product.find({
                    catId: req.query.catId,
                }).
                    populate({path: 'category', model: Category}).
                    populate({path: 'tags', model: Tag});
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
            productList = await Product.find(req.query).
                populate({path: 'category', model: Category}).
                populate({path: 'tags', model: Tag});
        }
        else if (req.query.category !== "" && req.query.cateogry !== null && req.query.category !== undefined){
            productList = await Product.find({catId: req.query.category}).
                populate({path: 'category', model: Category}).
                populate({path: 'tags', model: Tag});
        }
        else if (req.query.catName !== "" && req.query.catName !== null && req.query.catName !== undefined){
            productList = await Product.find({catName: req.query.catName}).
                populate({path: 'category', model: Category}).
                populate({path: 'tags', model: Tag});
        }
        else if (req.query.catId !== "" && req.query.catId !== null && req.query.catId !== undefined){
            productList = await Product.find({catId: req.query.catId}). 
                populate({path: 'category', model: Category}).
                populate({path: 'tags', model: Tag});
        }
        else if (req.query.subCatId !== "" && req.query.subCatId !== null && req.query.subCatId !== undefined){
            productList = await Product.find({subCatId: req.query.subCatId}). 
                populate({path: 'category', model: Category}).
                populate({path: 'tags', model: Tag});
            }

        if (req.query.rating !== "" && req.query.rating !== null && req.query.rating !== undefined){
            if (req.query.category !== "" && req.query.cateogry !== null && req.query.category !== undefined){
                if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                    productList = await Product.find({rating: req.query.rating, catId: req.query.category, location: req.query.location}).
                        populate({path: 'category', model: Category}).
                        populate({path: 'tags', model: Tag});
                }
                else {
                    productList = await Product.find({rating: req.query.rating, catId: req.query.category}). 
                        populate({path: 'category', model: Category}).
                        populate({path: 'tags', model: Tag});
                }
            }
        }

        if (req.query.rating !== "" && req.query.rating !== null && req.query.rating !== undefined){
            if (req.query.subCatId !== "" && req.query.subCatId !== null && req.query.subCatId !== undefined){
                if (req.query.location !== undefined && req.query.location !== null && req.query.location !== "All"){
                    productList = await Product.find({rating: req.query.rating, subCatId: req.query.subCatId, location: req.query.location}).
                        populate({path: 'category', model: Category}).
                        populate({path: 'tags', model: Tag});
                }
                else {
                    productList = await Product.find({rating: req.query.rating, subCatId: req.query.subCatId}).
                        populate({path: 'category', model: Category}).
                        populate({path: 'tags', model: Tag});
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

router.get('/homepage', async (req, res) => {
    try {
        const { userId, limit = 20, page = 1, sort, minPrice, maxPrice } = req.query;

        // Define thresholds for each category
        const thresholds = {
            topSellers: 0, // Minimum sales count to qualify as a top seller
            mostPopular: 0, // Minimum popularity score to qualify as most popular
            newlyReleasedDays: 30 // Products released within the last 30 days are considered newly released
        };

        const now = new Date();

        let recommendedProducts = [];

        // Fetch products for each category
        // const topSellers = await Product.find({ 
        //     // is_top_seller: true, 
        //     salesCount: { $gte: thresholds.topSellers }, // Apply sales count threshold
        //     price: { $gte: minPrice || 0, $lte: maxPrice || Number.MAX_VALUE } 
        // })
        //     .sort({ salesCount: -1 }) // Sort top sellers by sales count
        //     .lean()
        //     .limit(limit);

        const mostPopular = await Product.find({ 
            // is_popular: true, 
            popularityScore: { $gte: thresholds.mostPopular }, // Apply popularity score threshold
            price: { $gte: minPrice || 0, $lte: maxPrice || Number.MAX_VALUE } 
        })
            .sort({ popularityScore: -1 }) // Sort most popular by popularity score
            .lean()
            .limit(limit);


        const newlyReleased = await Product.find({
            dateCreated: { $gte: new Date(now.setDate(now.getDate() - thresholds.newlyReleasedDays)) } // Filter products released within the threshold
        })
            .sort({ dateCreated: -1 }) // Sort by newest release date
            .lean()
            .limit(limit);

            const user = await User.findById(userId).populate('recentlyViewed').lean();
            const recentlyViewed = user?.recentlyViewed || [];

            
            // Fetch user-specific data if a userId is provided
            if (userId) {
                const user = await User.findById(userId).populate(['recentlyViewed', 'purchaseHistory']).lean();
    
                if (user) {
                    // Get products from purchase history and recently viewed
                    const purchaseHistory = user.purchaseHistory.map(p => p._id.toString());
                    const recentlyViewed = user.recentlyViewed.map(p => p._id.toString());
    
                    // Find related products based on purchase and viewing history
                    const relatedProducts = await Product.find({
                        _id: { $nin: [...purchaseHistory, ...recentlyViewed] }, // Exclude already viewed/purchased
                        tags: { $in: user.purchaseHistory.flatMap(p => p.tags || []) },
                    }).lean();
    
                    recommendedProducts = relatedProducts.map(p => ({ ...p, category: 'related' }));
                }
            }
    
            // Fetch global recommended products if no specific user data
            const globallyRecommended = await Product.find({ is_recommended: true })
                .sort({ popularity_score: -1 })
                .limit(limit)
                .lean();
    
            // Combine both sources
            recommendedProducts = [
                ...recommendedProducts,
                ...globallyRecommended.map(p => ({ ...p, category: 'global' })),
            ];

        // Combine products from all categories
        const combinedProducts = [
            {products: recentlyViewed, category: 'recentlyViewed'},
            {products: newlyReleased, category: 'newlyReleased'},
            {products: mostPopular, category: 'mostPopular'},
            // ...topSellers.map((p) => ({ ...p, category: 'topSeller'})),
        ];

        if (sort) {
            switch (sort) {
                case 'priceAsc':
                    sortedProducts = combinedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'priceDesc':
                    sortedProducts = combinedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'popularity':
                    sortedProducts = combinedProducts.sort((a, b) => b.popularityScore - a.popularityScore);
                    break;
                case 'sales':
                    sortedProducts = combinedProducts.sort((a, b) => b.salesCount - a.salesCount);
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid sort parameter' });
            }
        }

       

        res.json({
            total: combinedProducts.length,
            page: parseInt(page),
            limit: parseInt(limit),
            combinedProducts: combinedProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch homepage products' });
    }
});

router.get('/recommended', async (req, res) => {
    try {
        const { userId, limit = 10, sort = 'popularity' } = req.query;

        let recommendedProducts = [];

        // Fetch user-specific data if a userId is provided
        if (userId) {
            const user = await User.findById(userId).populate(['recentlyViewed', 'purchaseHistory']).lean();

            if (user) {
                // Get products from purchase history and recently viewed
                const purchaseHistory = user.purchaseHistory.map(p => p._id.toString());
                const recentlyViewed = user.recentlyViewed.map(p => p._id.toString());

                // Find related products based on purchase and viewing history
                const relatedProducts = await Product.find({
                    _id: { $nin: [...purchaseHistory, ...recentlyViewed] }, // Exclude already viewed/purchased
                    tags: { $in: user.purchaseHistory.flatMap(p => p.tags || []) },
                }).lean();

                recommendedProducts = relatedProducts.map(p => ({ ...p, category: 'related' }));
            }
        }

        // Fetch global recommended products if no specific user data
        const globallyRecommended = await Product.find({ is_recommended: true })
            .sort({ popularity_score: -1 })
            .limit(limit)
            .lean();

        // Combine both sources
        recommendedProducts = [
            ...recommendedProducts,
            ...globallyRecommended.map(p => ({ ...p, category: 'global' })),
        ];

        // Deduplicate products by ID
        const uniqueProducts = Array.from(
            new Map(recommendedProducts.map(p => [p._id.toString(), p])).values()
        );

        // Sort products if requested
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    uniqueProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    uniqueProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'popularity':
                    uniqueProducts.sort((a, b) => b.popularityScore - a.popularityScore);
                    break;
                case 'sales':
                    uniqueProducts.sort((a, b) => b.sales_count - a.salesCount);
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid sort parameter' });
            }
        }

        // Limit results
        const finalProducts = uniqueProducts.slice(0, limit);

        res.json({
            total: uniqueProducts.length,
            limit: parseInt(limit),
            recommendedProducts: finalProducts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch recommended products' });
    }
});




router.get('/:id', async (req, res) => {
    try {

        const product = await Product.findById(req.params.id).
        populate({path: 'category', model: Category}).
        populate({path: 'tags', model: Tag});

        if (!product) return res.status(404).json({ error: 'Product not found' });

        product.views += 1;
        product.lastInteraction = Date.now();
        await product.save();

        product.popularityScore = calculatePopularityScore(product);


        return res.status(200).send(product);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to get product.' });
    }

});

router.post('/sale/:id/', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        product.salesCount += req.body.quantity || 1;
        product.lastInteraction = Date.now();
        await product.save();

        product.popularityScore = calculatePopularityScore(product);


        res.json({ message: 'Sale count updated', product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update sales count' });
    }
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

function calculatePopularityScore(product) {
    const w1 = 0.5; // Weight for sales count
    const w2 = 2;   // Weight for average rating
    const w3 = 0.3; // Weight for review count
    const w4 = 0.1; // Weight for view count

    return (
        w1 * product.salesCount +
        w2 * product.averageRating +
        w3 * product.reviewCount +
        w4 * product.view_count
    );
}















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