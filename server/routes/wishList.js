const express = require("express");
const Wishlist = require("../models/wishList");
const { verifyToken, authorize } = require('../middleware/auth');
const router = express.Router();

/** 
 * @route GET /api/cart
 * @desc Fetch user's cart
 * @access Private
 */
router.get("/", verifyToken, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("items.product");

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, items: [] });
        }

        res.json({wishlist, msg: "Success"});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

/** 
 * @route POST /api/cart/add
 * @desc Add a product to the cart
 * @access Private
 */
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, items: [] });
        }

        const productExists = wishlist.items.find(item => item.product.toString() === productId);

        if (productExists) {
            // productExists.quantity += quantity;
            res.json({wishlist, msg: "Item exist in wishlist."});

        } else {
            wishlist.items.push({ product: productId});

            await wishlist.save();
            res.json({wishlist, msg: "Item added successfully!"});
        }

       
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error });
    }
});


/** 
 * @route DELETE /api/cart/remove/:itemId
 * @desc Remove a product from the wishlist
 * @access Private
 */
router.delete("/remove/:itemId", verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) return res.status(404).json({ message: "Item not found" });

        wishlist.items = wishlist.items.filter(item => item._id.toString() !== req.params.itemId);
        await wishlist.save();

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

/** 
 * @route DELETE /api/cart/clear
 * @desc Clear the wishlist
 * @access Private
 */
router.delete("/clear", verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOneAndUpdate({ user: req.user.id }, { items: [] }, { new: true });
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
