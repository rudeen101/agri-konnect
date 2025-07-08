import HomeSliderBanner from "../models/homeSliderBanner.js";
import express from "express";
const router = express.Router();
import { verifyToken, authorize } from '../middleware/auth.js';

router.get('/', async (req, res) => {
    try {
        // For a simple implementation, return all banners.
        // To implement scheduling, uncomment and adjust the following filter:
        //
        // const now = new Date();
        // const banners = await Banner.find({
        //   $or: [
        //     { startDate: { $exists: false } },
        //     { startDate: { $lte: now } }
        //   ],
        //   $or: [
        //     { endDate: { $exists: false } },
        //     { endDate: { $gte: now } }
        //   ]
        // }).lean();
        const homeSliderBanner = await HomeSliderBanner.find();
        res.json({ homeSliderBanner });
    } catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

router.get('/:id',  async (req, res) => {

    try {
        const bannerId = req.params.id;

        const homeSliderBanner = await HomeSliderBanner.findById(bannerId);
      
        return res.status(200).send(homeSliderBanner);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to Home Slider Banner' });
    }

});

/**
 * POST /api/homeSliderBanner
 * Creates a new banner.
 * Protected route: Only admin can create banners.
 */
router.post('/create', verifyToken, authorize('admin'), async (req, res) => {
    try {
        const newBanner = new HomeSliderBanner(req.body);
        await newBanner.save();

        res.status(201).json({ message: 'Banner created successfully', homeSliderBanner: newBanner });
    } catch (error) {
        console.error("Error creating banner:", error);
        res.status(500).json({ error: 'Failed to create banner' });
    }
});

/**
 * PUT /api/homeSliderBanner/:bannerId
 * Updates an existing banner.
 * Protected route: Only admin can update banners.
 */
router.put('/:bannerId', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const updatedBanner = await HomeSliderBanner.findByIdAndUpdate(
        req.params.bannerId, 
        req.body, 
        { new: true, runValidators: true }
    );

    if (!updatedBanner) return res.status(404).json({ error: 'Banner not found' });

    res.json({ message: 'Banner updated successfully', homeSliderBanner: updatedBanner });

  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

/**
 * DELETE /api/homeSliderBanner/:bannerId
 * Deletes a banner.
 * Protected route: Only admin can delete banners.
 */
router.delete('/:id', verifyToken, authorize('admin'), async (req, res) => {
    try {
        const deletedBanner = await HomeSliderBanner.findByIdAndDelete(req.params.id);

        if (!deletedBanner) return res.status(404).json({ error: 'Banner not found' });

        res.json({ message: 'Banner deleted successfully' });

    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({ error: 'Failed to delete banner' });
    }
});


export default router;




