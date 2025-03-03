const calculatePopularityScore = (product) => {
    const { salesCount, averageRating, reviewCount, views, wishlistCount } = product;

    const reviewScore = averageRating * reviewCount; // More reviews + higher rating = better score

    const popularityScore = (salesCount * 3) + (reviewScore * 2) + (views * 1) + (wishlistCount * 1);

    return popularityScore;
};

module.exports = calculatePopularityScore;
