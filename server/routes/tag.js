const  Tag = require('../models/tag');
const Product = require("../models/product");
const Category = require("../models/category");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { error } = require('console');


// Use mongoose.Types.ObjectId
const ObjectId = mongoose.Types.ObjectId;


// Fetch all tags
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.find().
            populate({path: 'category', model: Category});
        res.json(tags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch tags." });
    }
});

// Fetch tag with specific category id
router.get("/category/:catId", async (req, res) => {
    try {
        const { catId } = req.params;

        // Validate that the category ID is valid
        if (!mongoose.Types.ObjectId.isValid(catId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        // Query tags by category ID
        const tags = await Tag.find({ category: catId }).lean();

        if (!tags.length) {
            return res.status(404).json({ message: 'No tags found for this category' });
        }

        res.json({ tags });
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tags' });
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

// Delete Tag Endpoint
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the tag exists before deleting
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        // Delete the tag
        await Tag.findByIdAndDelete(id);

        // Remove the tag from products
        await Product.updateMany(
            { tags: id },
            { $pull: { tags: id } } // Remove tagId from the tags array
        );

        res.status(200).json({ message: 'Tag deleted and references removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete tag' });
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



