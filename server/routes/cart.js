const  Cart = require('../models/cart');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const { error } = require('console');


router.get('/', async (req, res) => {
    try {
        const cartList = await Cart.find();

        if (!cartList) {
            res.status(500).json({success: false})
        }

        res.status(200).json({success: true, data: cartList})

    } catch (error) {
        console.log(error)

        res.status(500).json({success: false, error: error});
    }
});

router.get('/:id', async (req, res) => {
    const cartItemId = req.params.id;

    const cartItem = await Cart.findById(cartItemId);
    if (!cartItem) {
        res.status(500).json({success: false, msg: "Cart item with given id not found!"});
    }

    res.status(200).send(cartItem);
});

router.post('/add', async (req, res) => {

    const {userId, productId, price, productName, rating, subTotal, countInStock, image, quantity} = req.body;

    const cartItem = await Cart.find({productId: productId, userId: userId });

    if (cartItem.length === 0) {
            let cartList = new Cart({
            userId: userId,
            productId: productId,
            price: price, 
            productName: productName, 
            rating: rating, 
            price: price, 
            subTotal: subTotal, 
            countInStock: countInStock, 
            quantity: quantity, 
            image: image
        });

        if (!cartList) {
            res.status(500).json({
                error: error,
                success: false
            })
        }
    
        cartList = await cartList.save();
    
        imagesArr = [];
    
        res.status(201).json(cartList);

    } else {
        res.status(401).json({status: false, msg: "Product already added to cart"});
    }


});   

router.delete('/:id', async (req, res) => {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
        res.status(404).json({success: false, msg: "Cart item with id not found!"})
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
        res.status(404).json({
            msg: "Cart item not found",
            success: false
        });
    }

    res.status(200).json({
        msg: "Cart item deleted successfully",
        success: false
    });
    

});


router.put('/:id', async (req, res) => {

    const {userId, productId, price, productName, rating, subTotal, countInStock, image} = req.body;

    const cartItem = await Cart.findByIdAndUpdate(req.params.id, 
        {
            userId: userId,
            productId: productId,
            price: price, 
            productName: productName, 
            rating: rating, 
            subTotal: subTotal, 
            countInStock: countInStock, 
            image: image
        },
        {new: true}
    )

    if (!cartItem) {
        return res.status(500).json({
            msg: "Cart item cannot be updated!",
            success: false
        })
    }

    res.status(200).send(cartItem   );
});

module.exports = router;



