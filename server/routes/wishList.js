const  WishList = require('../models/wishList');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { error } = require('console');


router.get('/', async (req, res) => {
    try {
        const wishList = await WishList.find();

        if (!wishList) {
            res.status(500).json({success: false})
        }

        res.status(200).json({success: true, data: wishList})

    } catch (error) {
        console.log(error)

        res.status(500).json({success: false, error: error});
    }
});

router.get('/:id', async (req, res) => {
    const wishListId = req.params.id;

    const wishItem = await WishList.findById(wishListId);
    if (!wishProduct) {
        res.status(500).json({success: false, msg: "Wishlist item with given id not found!"});
    }

    res.status(200).send(wishItem);
});

router.post('/add', async (req, res) => {

    const {userId, productId, price, productName, rating, image} = req.body;

    const wishListItem = await WishList.find({productId: productId, userId: userId });

    if (wishListItem.length === 0) {
            let wishList = new WishList({
            userId: userId,
            productId: productId,
            price: price, 
            productName: productName, 
            rating: rating, 
            image: image
        });

        if (!wishList) {
            res.status(500).json({
                error: error,
                success: false
            })
        }
    
        wishList = await wishList.save();
    
        imagesArr = [];
    
        res.status(201).json(wishList);

    } else {
        res.status(401).json({status: false, msg: "Product already added to WishList"});
    }


});   

router.delete('/:id', async (req, res) => {
    const wishListItem = await WishList.findById(req.params.id);

    if (!wishListItem) {
        res.status(404).json({success: false, msg: "WishList item with id not found!"})
    }

    const deletedItem = await WishList.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            msg: "WishList item not found",
            success: false
        });
    }

    res.status(200).json({
        msg: "WishList item deleted successfully",
        success: false
    });
    

});


// router.put('/:id', async (req, res) => {

//     const {userId, productId, price, productName, rating, subTotal, countInStock, image} = req.body;

//     const WishListItem = await WishList.findByIdAndUpdate(req.params.id, 
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

//     if (!WishListItem) {
//         return res.status(500).json({
//             msg: "WishList item cannot be updated!",
//             success: false
//         })
//     }

//     res.status(200).send(WishListItem   );
// });

module.exports = router;



