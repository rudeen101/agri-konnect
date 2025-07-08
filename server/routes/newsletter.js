import express from "express";
import Newsletter from "../models/newsletter.js";

const router = express.Router();

// Subscribe to Newsletter
router.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email format
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ error: "Email already subscribed!" });
        }

        // Save new subscriber
        await new Newsletter({ email }).save();
        res.status(201).json({ message: "Subscribed successfully!" });

    } catch (error) {
        res.status(500).json({ error: "Server error, please try again" });
    }
});

export default router;
