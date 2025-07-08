import User from "../models/users.js";

const findSimilarUsers = async (userId) => {
    try {
        const user = await User.findById(userId).populate("purchaseHistory recentlyViewed");

        if (!user) return [];

        const purchasedProductIds = user.purchaseHistory.map(product => product._id);
        const recentlyViewedProductsId = user.recentlyViewed.map(product => product._id);

        // Find other users who purchased or viewed at least one of the same products
        const similarUsers = await User.find({
            _id: { $ne: userId }, // Exclude the current user
            purchaseHistory: { $in: purchasedProductIds },
            recentlyViewed: { $in: recentlyViewedProductsId }
        }).select("_id purchaseHistory recentlyViewed");

        return similarUsers;
    } catch (error) {
        console.error("Error finding similar users:", error);
        return [];
    }
};

export default findSimilarUsers;