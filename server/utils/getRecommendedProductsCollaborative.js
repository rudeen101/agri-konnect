const User = require("../models/users");
const Product = require("../models/product");
const findSimilarUsers = require("../utils/findSimilarUser")

const getRecommendedProductsCollaborative = async (userId) => {
    try {
        const user = await User.findById(userId).populate("purchaseHistory recentlyViewed");

        if (!user) return [];

        const purchasedProductIds = user.purchaseHistory.map(product => product._id);
        const recentlyViewedProductIds = user.recentlyViewed.map(product => product._id);

        // Find similar users
        const similarUsers = await findSimilarUsers(userId);

        // Get products purchased and viewed by similar users that the current user hasn't purchased or viewed yet
        let recommendedProductIds = new Set();

        for (const similarUser of similarUsers) {
            for (const productId of similarUser.purchaseHistory) {
                if (!purchasedProductIds.includes(productId.toString())) {
                    recommendedProductIds.add(productId.toString());
                }
            }

            for (const productId of similarUser.recentlyViewed) {
                if (!recentlyViewedProductIds.includes(productId.toString())) {
                    recommendedProductIds.add(productId.toString());
                }
            }
        }

        // Fetch product details
        const recommendedProducts = await Product.find({
            _id: { $in: Array.from(recommendedProductIds) }
        }).sort({ popularityScore: -1 }).limit(10).lean();

        return recommendedProducts;
    } catch (error) {
        console.error("Error fetching collaborative recommendations:", error);
        return [];
    }
};

module.exports = getRecommendedProductsCollaborative;
