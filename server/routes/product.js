const  Category = require('../models/category');
const  User = require('../models/users');
const  ProductReviews = require('../models/productReviews');
const  Product = require('../models/product');
const  calculatePopularityScore = require('../utils/calculatePopularityScore');
const  Tag = require('../models/tag');
const {ImageUpload} = require("../models/imageUpload");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { error } = require('console');
const { verifyToken, authorize } = require('../middleware/auth');
const cloudinary = require("cloudinary").v2;
const getRecommendedProductsCollaborative = require("../utils/getRecommendedProductsCollaborative")


var imagesArray = [];


// cloudinary.config({ 
//     cloud_name: process.env.cloudinary_config_cloud_name,
//     api_key: process.env.cloudinary_config_api_key,
//     api_secret: process.env.cloudinary_config_api_secret,
//     secure: true
// });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },

//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, `${uniqueSuffix}_${file.originalname}`);
//     }
// })

// const upload = multer({ storage: storage })


// router.post('/upload', upload.array("images"), async (req, res) => {

//     var imagesArr = [];

//     try {
        
//         for (let i = 0; i < req?.files?.length; i++) {
//             const options =  {
//                 use_filename: true,
//                 unique_filename: false,
//                 overwrite: false
//             }
        
//             const imagesUpload = await cloudinary.uploader.upload(
//                 req.files[i].path,
//                 options,
//                 function (error, result) {
//                     console.log(result)
//                     imagesArr.push(result.secure_url);
//                     console.log(`uploads/${req.files[i].filename}`)
//                     fs.unlinkSync(`uploads/${req.files[i].filename}`);
//                 }
//             );

//             let imagesUploaded = new ImageUpload({
//                 images: imagesArr
//             });

//             imagesUploaded = await imagesUploaded.save();
//             return res.status(200).json(imagesArr);
//         }
//     } catch (error) {
//         console.log(error);
//     }

// }); 

router.post('/create', verifyToken, authorize(['admin', 'seller']), async (req, res) => {

    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).send("Invalid Category")
        }
        

        let newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            subCatId: req.body.subCatId,
            catId: req.body.catId,
            catName: req.body.catName,
            subCat: req.body.subCat,
            category: req.body.category,
            countInStock: req.body.countInStock,
            isFeatured: req.body.isFeatured,
            productWeight: req.body.productWeight,
            packagingType: req.body.packagingType,
            minOrder: req.body.minOrder,
            estimatedDeliveryDate: req.body.estimatedDeliveryDate,
            tags: req.body.tags,
            seller: req.user.id,
            location: req.body.location !== "" ? req.body.location : "All",
        }); 
      
        newProduct = await newProduct.save();
    
        // imagesArray = []
        res.status(201).json({ message: 'Product created successfully', product: newProduct });

    } catch (err) {
        console.log(err)
    res.status(500).json({ error: 'Failed to create product' });
    }

});

router.get('/', async (req, res) => {

    try {
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
                .sort({ dateCreated: -1 })
                .exec()
            }
            else{
                productList = await Product.find().populate({path: 'category', model: Category})
                .skip((page - 1) * perPage)
                .limit(perPage)
                .sort({ dateCreated: -1 })
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

            return res.status(200).json({
                "products": productList,
                "totalPages": totalPages,
                "page": page
            });

        }

      
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// DELETE product (admin and seller)
router.delete('/:id', verifyToken, authorize('admin', "seller"), async (req, res) => {

    try {
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
            message: "Product deleted successfully"
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

router.get('/homepage', async (req, res) => {
    try {
        const { userId, limit = 20, page = 1, sort, minPrice, maxPrice } = req.query;

        // Define thresholds for each category
        const thresholds = {
            topSellers: 0, // Minimum sales count to qualify as a top seller
            mostPopular: 0, // Minimum popularity score to qualify as most popular
            newlyReleasedDays: 5 // Products released within the last 30 days are considered newly released
        };

        const now = new Date();

        // fetch more popular products
        const mostPopular = await Product.find({ 
            // is_popular: true, 
            popularityScore: { $gte: thresholds.mostPopular }, // Apply popularity score threshold
            price: { $gte: minPrice || 0, $lte: maxPrice || Number.MAX_VALUE } 
        })
            .sort({ popularityScore: -1 }) // Sort most popular by popularity score
            .lean()
            .limit(limit);


        // fetch newly released products
        const newlyReleased = await Product.find({
            dateCreated: { $gte: new Date(now.setDate(now.getDate() - thresholds.newlyReleasedDays)) } // Filter products released within the threshold
        })
            .sort({ dateCreated: -1 }) // Sort by newest release date
            .lean()
            .limit(limit);

        // fetch popular products by category
        const categories = await Category.find();
        const categoryList = []

        // loop through each featured category to get its popular products
        for (const category of categories) {
            if (category.type === "mainCategory" && category.isFeatured === true) {

                const products = await fetchPopularProductsByCategory(category._id, thresholds, 10);
                categoryList.push({
                    category: category.name,
                    products: products
                });
            }
        }


    // Combine products from all categories
    const combinedProducts = [
        {products: newlyReleased, category: 'newlyReleased'},
        {products: mostPopular, category: 'mostPopular'},
        {products: categoryList, category: 'catProducts'},
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

router.get('/recommended', verifyToken, async (req, res) => {
    try {
        if (req.user) {
            console.log("hello")
            const userId = req.user.id;
            const user = await User.findById(userId).populate("recentlyViewed purchaseHistory");
    
            if (!user) return res.status(404).json({ message: "User not found" });
    
            // Get product IDs from recently viewed and purchased
            const viewedProductIds = user.recentlyViewed.map(product => product._id);
            const purchasedProductIds = user.purchaseHistory.map(product => product._id);
    
            // Get recommended products based on category & tags
            let recommendedProducts = await Product.find({
                _id: { $nin: [...viewedProductIds, ...purchasedProductIds] }, // Exclude already viewed/purchased
                category: { $in: user.recentlyViewed.map(p => p.category) }, // Same category
                tags: { $in: user.recentlyViewed.flatMap(p => p.tags) } // Matching tags
            })
            .sort({ popularityScore: -1 }) // Sort by popularity
            .limit(10)
            .lean();

            // If not enough recommended products, fetch popular ones
            if (recommendedProducts.length < 10) {
                const popularProducts = await Product.find({
                    _id: { $nin: [...viewedProductIds, ...purchasedProductIds] }
                })
                .sort({ popularityScore: -1 })
                .limit(10)
                .lean();

                recommendedProducts = [...recommendedProducts, ...popularProducts];
            }

            res.status(200).json(recommendedProducts);
        } else {
            const popularProducts = await Product.find()
            .sort({ popularityScore: -1 })
            .limit(10)
            .lean();

            recommendedProducts = [...popularProducts];
            res.status(200).json(recommendedProducts);

        }

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get('/recommendedCollaborative/:userId', async (req, res) => {
    try {

        if (req.params.userId !== "undefined") {
            
            const userId = req.params.userId;
            const user = await User.findById(userId).populate("recentlyViewed purchaseHistory");
    
            if (!user) return res.status(404).json({ message: "User not found" });
    
            // Get products from collaborative filtering
            const collaborativeRecommendations = await getRecommendedProductsCollaborative(userId);
    
            // Get category & tag-based recommendations
            let recommendedProducts = await Product.find({
                _id: { $nin: [...user.recentlyViewed, ...user.purchaseHistory] },
                category: { $in: user.recentlyViewed.map(p => p.category) },
                tags: { $in: user.recentlyViewed.flatMap(p => p.tags) }
            }).populate('seller', 'name _id').sort({ popularityScore: -1 }).limit(10).lean();
    
            // Merge recommendations
            let recommendedCollaboration = [...recommendedProducts, ...collaborativeRecommendations];
    
            // If not enough recommendations, fetch popular products
            if (recommendedCollaboration.length < 10) {
                const popularProducts = await Product.find({
                    _id: { $nin: [...user.recentlyViewed, ...user.purchaseHistory] }
                }).populate('seller', 'name _id').sort({ popularityScore: -1 }).limit(5).lean();
                ;
    
                recommendedCollaboration = [...recommendedCollaboration, ...popularProducts];
            }
    
            res.status(200).json(recommendedCollaboration);
            
        } else {

            const recommendedCollaboration = await Product.aggregate([
                {
                    $match: { salesCount: { $gt: 1 } } // Example: Get products with at least 10 sales
                },
                {
                    $sort: { views: -1, rating: -1 } // Sort by highest views and ratings
                },
                {
                    $limit: 10 // Limit results to 10 products
                }
            ]);
            
            res.status(200).json(recommendedCollaboration);

        }

    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET product details by ID
router.get('/details/:id', async (req, res) => {
    try {

        const product = await Product.findById(req.params.id).
        populate({path: 'category', model: Category}).
        populate({path: 'tags', model: Tag});

        if (!product) return res.status(404).json({ error: 'Product not found' });

        product.views += 1;
        product.lastInteraction = Date.now();
        product.popularityScore = calculatePopularityScore(product);
        await product.save();
        
        return res.status(200).send(product);
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to get product.' });
    }

});

// Get related products by category (excluding the current product)
router.get("/related/:productId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const relatedProducts = await Product.find({
            subCatId: product.subCatId, // Match category
            _id: { $ne: product._id }, // Exclude current product
        }).limit(20); // Limit results

        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching related products" });
    }
});

// Add a product to recently viewed list
router.post('/recentlyViewed/add', verifyToken, async (req, res) => {
    try {

        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (req.user) {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: "User not found" });
    
            let updatedRecentlyViewed = user.recentlyViewed.filter(id => id.toString() !== productId);
            updatedRecentlyViewed.unshift(productId); // Add new product at the start
            updatedRecentlyViewed = updatedRecentlyViewed.slice(0, 6); // Keep only the last 6 items
    
            // Update the user document
            await User.findByIdAndUpdate(req.user.id, { recentlyViewed: updatedRecentlyViewed }, { new: true });
            res.status(200).json({ message: "Recently viewed updated", recentlyViewed: user.recentlyViewed });
            
        } else {
            const product = Product.findById(productId)
            res.status(200).json({ message: "Recently viewed updated", recentlyViewed: [product] });

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
});

//Fetch recently viewed products
router.get('/recentlyViewed', verifyToken, async (req, res) => {
    try {

        if (req.user) {
            const user = await User.findById(req.user.id).populate("recentlyViewed", "name price images countInStock packagingType");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.status(200).json(user.recentlyViewed);
        } else {
            res.status(200).json([]);
        }
       
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', verifyToken, authorize(['admin', 'seller']), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Ensure the product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product fields
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updatedData }, // Update only fields provided in the request
            { new: true, runValidators: true } // Return updated product and validate fields
        );

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// GET rating analytics for a specific product
router.get('/:productId/ratings', async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Fetch all reviews for the product
        const reviews = await ProductReviews.find({ productId: productId });

        if (reviews.length === 0) {
            return res.json({
                product: productId,
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: {
                    "5": 0,
                    "4": 0,
                    "3": 0,
                    "2": 0,
                    "1": 0
                }
            });
        }

        // Calculate average rating
        const totalReviews = reviews.length;
        const sumOfRatings = reviews.reduce((sum, review) => sum + review.customerRating, 0);
        const averageRating = (sumOfRatings / totalReviews).toFixed(1);

        // Count ratings for each star (1 to 5)
        const ratingDistribution = {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0
        };

        reviews.forEach(review => {
            ratingDistribution[review.customerRating]++;
        });

        res.json({
            product: productId,
            averageRating,
            totalReviews,
            ratingDistribution
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch rating analytics" });
    }
});

// Fetch popular products by category
const fetchPopularProductsByCategory = async (categoryId, thresholds, limit) => {
    try {

        const products = await Product.find({ 
            catId: categoryId,  // Ensure categoryId is an ObjectId
            popularityScore: { $gte: thresholds.mostPopular } 
        })
        .sort({ popularityScore: -1 })
        .lean()
        .limit(limit);

        return products;
    } catch (error) {
        console.error("Error fetching popular products:", error);
        return [];
    }
};






module.exports = router;