import Product from "../models/product.js";
import express from "express";
const router = express.Router();
import mongoose from "mongoose";



router.get('/', async (req, res) => {
    try {
        const query =  req.query.q;

        if (!query) {
            res.status(400).json({msg: "Query needed!"})
        } else{
            const items  = await Product.find({
                $or: [
                    { name: {$regex: query, $options: "i"} },
                    { brand: {$regex: query, $options: "i"} },
                    { catName: {$regex: query, $options: "i"} },
                    { subCat: {$regex: query, $options: "i"} },
                    { description: {$regex: query, $options: "i"} },
                ]
            })
    
            res.json(items);
        }

     
    } catch (error) {
        res.status(500).json({msg: "Server error"});
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

export default router;



