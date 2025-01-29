const  Tag = require('../models/tag');
const Product = require("../models/product");
const Category = require("../models/category");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { error } = require('console');


// Fetch all tags
router.get("/", async (req, res) => {
    console.log("hello")
    try {
        const tags = await Tag.find().
            populate({path: 'catId', model: Category});
        res.json(tags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tags." });
    }
});

// Add a new tag
router.post("/add", async (req, res) => {
    try {
        const { name, category, description } = req.body;

        const newTag = new Tag({ name, category, description });
        await newTag.save();

        res.status(201).json({ message: "Tag created successfully!", tag: newTag });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: "Tag already exists." });
        } else {
            console.error(err);
            res.status(500).json({ error: "Failed to create tag." });
        }
    }
});

router.delete('/:id', async (req, res) => {

    try {
        const { id } = req.params;

        const deleteTag = await Tag.findByIdAndDelete(id);
        console.log(id);

        if (!deleteTag) {
            return res.status(404).json({ error: "Tag not found." });
        }

        res.json({ message: "Tag deleted successfully!", tag: deleteTag });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete tag!" });
    }
});


// Add tags to a product
// router.patch("tag/product/:productId", async (req, res) => {
    // try {
    //     const { productId } = req.params;
    //     const { tagIds } = req.body; // Array of tag IDs

    //     const updatedProduct = await Product.findByIdAndUpdate(
    //         productId,
    //         { $addToSet: { tags: { $each: tagIds } } }, // Add multiple tags without duplicates
    //         { new: true }
    //     ).populate("tags"); // Populate tags for better response clarity

    //     if (!updatedProduct) {
    //         return res.status(404).json({ error: "Product not found." });
    //     }

    //     res.json({ message: "Tags added successfully!", product: updatedProduct });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: "Failed to add tags to product." });
    // }
// });

// // Filter products by tags
// router.get("/tags/products", async (req, res) => {
//     try {
//         const { tagIds } = req.query; // Comma-separated list of tag IDs (e.g., "63c0f3a3c6b2a17a3f4e6d1a,63c0f3a3c6b2a17a3f4e6d1b")
//         const tagArray = tagIds ? tagIds.split(",") : [];

//         const products = await Product.find({ tags: { $in: tagArray } }).populate("tags");

//         res.json(products);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to fetch products." });
//     }
// });





  



module.exports = router;



