const  ProductReviews = require('../models/productReviews');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { error } = require('console');


router.get('/', async (req, res) => {
    let reviews = [];

    try {

        if(req.query.productId !== undefined && req.query.productId !== null && req.query.productId !== "" ){
            reviews = await ProductReviews.find({productId: req.query.productId});
        } else {
            reviews = await ProductReviews.find();
        }

        if (!reviews) {
            res.status(500).json({success: false})
        }

        res.status(200).json({success: true, data: reviews})

    } catch (error) {
        console.log(error)

        res.status(500).json({success: false, error: error});
    }
});

router.get('/get/count', async (req, res) => {
 
    const productReviews = await ProductReviews.countDcuments();

    if (!cartItem) {
        res.status(500).json({success: false, msg: "Cannot get reviews count"});
    }

    res.status(200).send({productsReview: productReviews});
});

router.get('/:id', async (req, res) => {
    const reviewsId = req.params.id;

    const productReviews = await Cart.findById(reviewsId);

    if (!reviewsId) {
        res.status(500).json({success: false, msg: "Review with given id not found!"});
    }

    res.status(200).send(productReviews);
});

router.post('/add', async (req, res) => {

    const {customerId, customerName , review, customerRating, productId} = req.body;

    let productReviewObj = new ProductReviews({
        customerId: customerId,
        customerName: customerName,
        review: review, 
        productName: review, 
        customerRating: customerRating, 
        productId: productId, 
    });

    if (!productReviewObj) {
        res.status(500).json({
            error: error,
            success: false
        })
    }

    productReviewObj = await productReviewObj.save();
    
    res.status(201).json(productReviewObj);

});   

router.delete('/:id', async (req, res) => {
    const review = await ProductReviews.findById(req.params.id);

    if (!review) {
        res.status(404).json({success: false, msg: "Review with id not found!"})
    }

    const deletedItem = await ProductReviews.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            msg: "Review not found",
            success: false
        });
    }

    res.status(200).json({
        msg: "Review deleted successfully",
        success: false
    });
    

});


// router.put('/:id', async (req, res) => {
//     console.log("edit", req.body)

//     const {userId, productId, price, productName, rating, subTotal, countInStock, image} = req.body;

//     const cartItem = await Cart.findByIdAndUpdate(req.params.id, 
//         {
//             userId: userId,
//             productId: productId,
//             price: price, 
//             productName: productName, 
//             rating: rating, 
//             subTotal: subTotal, 
//             countInStock: countInStock, 
//             image: image
//         },
//         {new: true}
//     )

//     if (!cartItem) {
//         return res.status(500).json({
//             msg: "Cart item cannot be updated!",
//             success: false
//         })
//     }

//     res.status(200).send(cartItem   );
// });

module.exports = router;



