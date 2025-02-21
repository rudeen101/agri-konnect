
const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');

// 🛒 Add product to cart
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Check stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (quantity > product.stock) return res.status(400).json({ message: "Not enough stock" });

        // Find cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [{ productId, quantity }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🛍️ Get user cart
router.get("/", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("products.product");
        if (!cart) return res.status(200).json({ message: "Cart is empty", products: [] });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }

});


// Remove product from cart
router.delete("/remove/:productId", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Product removed", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;













// Fetch User Cart
// router.get("/", verifyToken, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
//         res.status(200).json(cart || { user: req.user.id, items: [] });
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// Add Product to Cart
// router.post("/add", verifyToken, async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;
//         let cart = await Cart.findOne({ user: req.user.id });

//         if (!cart) {
//             cart = new Cart({ user: req.user.id, items: [] });
//         }

//         const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

//         if (itemIndex > -1) {
//             cart.items[itemIndex].quantity += quantity;
//         } else {
//             cart.items.push({ product: productId, quantity });
//         }

//         await cart.save();
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Update Product Quantity in Cart
// router.put("/update", verifyToken, async (req, res) => {
//     try {
//         const { productId, quantity } = req.body;
//         const cart = await Cart.findOne({ user: req.user.id });

//         if (!cart) return res.status(404).json({ error: "Cart not found" });

//         const item = cart.items.find(item => item.product.toString() === productId);
//         if (item) {
//             item.quantity = quantity;
//             await cart.save();
//             res.status(200).json(cart);
//         } else {
//             res.status(404).json({ error: "Product not found in cart" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Remove Product from Cart
// router.delete("/remove/:productId", authenticate, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user.id });
//         if (!cart) return res.status(404).json({ error: "Cart not found" });

//         cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
//         await cart.save();
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// module.exports = router;
