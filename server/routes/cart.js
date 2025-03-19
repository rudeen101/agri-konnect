const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { verifyToken, authorize } = require('../middleware/auth');
const router = express.Router();

/** 
 * @route GET /api/cart
 * @desc Fetch user's cart
 * @access Private
 */
router.get("/", verifyToken, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        res.json({cart, msg: "Success"});
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
        // // Check stock
        // const product = await Product.findById(productId);
        // if (!product) return res.status(404).json({ message: "Product not found" });
        // if (quantity > product.stock) return res.status(400).json({ message: "Not enough stock" });

        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }

        const productExists = cart.items.find(item => item.product.toString() === productId);

        if (productExists) {
            // productExists.quantity += quantity;
            res.json({cart, msg: "Item exist in cart."});

        } else {
            cart.items.push({ product: productId, quantity });

            await cart.save();
            res.json({cart, msg: "Item added successfully!"});
        }

       
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error });
    }
});

/** 
 * @route PUT /api/cart/update/:itemId
 * @desc Update quantity of a product in cart
 * @access Private
 */
router.put("/update/:itemId", verifyToken, async (req, res) => {
    try {
        console.log(req.user.id)
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(item => item.product.toString() === req.params.itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

/** 
 * @route DELETE /api/cart/remove/:itemId
 * @desc Remove a product from the cart
 * @access Private
 */
router.delete("/remove/:itemId", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

/** 
 * @route DELETE /api/cart/clear
 * @desc Clear the cart
 * @access Private
 */
router.delete("/clear", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { new: true });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
