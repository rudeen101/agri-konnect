import Order  from "../models/order.js"

const verifyBuyer = async (req, res, next) => {
    const { id } = req.user; // Get user ID from JWT
    const { productId } = req.body;

    try {
       
        const order = await Order.findOne(
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

export default verifyBuyer;
