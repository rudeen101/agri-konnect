const Order = require("../models/order");

const verifyBuyer = async (req, res, next) => {
    const { userId } = req.user; // Get user ID from JWT
    const { productId } = req.body;

    try {
        const order = await Order.findOne({
            user: userId,
            "items.product": productId,
            status: "Completed"
        });

        if (!order) {
            return res.status(403).json({ message: "Only verified buyers can review this product." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = verifyBuyer;
