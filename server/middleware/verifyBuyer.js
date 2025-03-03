const { Order, SubOrder } = require("../models/order");

const verifyBuyer = async (req, res, next) => {
    const { id } = req.user; // Get user ID from JWT
    const { productId } = req.body;

    console.log(productId)

    try {
       
        const order = await SubOrder.findOne(
            { 
                orderedBy: id, 
                "orderItems.product": productId,
                "orderItems.status": "completed"
            }, 
        );

        if (!order) {
            return res.status(403).json({ message: "Only verified buyers can review this product.", error: true });
        }

        next();
    } catch (error) {
        console.log("verifyBuyer error: ",error)
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = verifyBuyer;
