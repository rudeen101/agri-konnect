// routes/orders.js
const express = require('express');
const {Order, SubOrder} = require('../models/order');
const Product = require('../models/product');
// const SubOrder = require('../models/order');
const User = require('../models/users');
const { verifyToken, authorize } = require('../middleware/auth');
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const calculatePopularityScore = require('../utils/calculatePopularityScore');

const router = express.Router();


router.post("/create", verifyToken,  async (req, res) => {
    try {
		const { deliveryAddress, paymentDetails, orderItems, totalPrice } = req.body;

		if (!deliveryAddress || !paymentDetails || !orderItems.length || !totalPrice) {
			return res.status(400).json({ error: "All fields are required!" });
		}

		const generateOrderNumber = () => {
			return `ORD-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
		};

		const mainOrder = new Order({
			orderNumber: generateOrderNumber(), 
			orderedBy: req.user.id,
			totalPrice,
			pickupStation: deliveryAddress.pickupStation
		});

        await mainOrder.save();

        // Group items by seller
        const sellerOrders = {};
        orderItems.forEach(item => {
            if (!sellerOrders[item.seller]) {
                sellerOrders[item.seller] = [];
            }
            sellerOrders[item.seller].push(item);
        });

        // Create sub-orders for each seller
        for (const seller in sellerOrders) {
            const subOrder = new SubOrder({
                mainOrder: mainOrder._id,
				receivedBy: seller,
                orderedBy: req.user.id,
				deliveryAddress,
				paymentDetails,
                orderItems: sellerOrders[seller],
                subTotal: sellerOrders[seller].reduce((sum, item) => sum + item.price * item.quantity, 0),
                trackingNumber: `TRK${Date.now()}${seller}`
            });

            await subOrder.save();

			const sellerData = await User.findById(seller);
			const contact = getContactType(sellerData.contact);
            if (contact) {
                const message = `New order placed! Order Number: ${mainOrder.orderNumber}. Please check your seller dashboard.`;
                
                // Send Email
                if (contact.type === "email") {
					await sendEmail(contact.email, "New Order Received", message);
                }

                // Send WhatsApp Message
                if (contact.phone) {
                    await sendWhatsAppMessage(contact.phone, message);
                }
                
                // Push Notification (Optional)
                // sendPushNotification(sellerId, message);
            }

        }

        res.status(201).json({ message: "Order placed successfully", orderNumber: mainOrder.orderNumber });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Order processing failed" });
    }
});

// GET all main orders
router.get('/', verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const order = await Order.find();
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ order });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch order ' });
    }
});

// Get all sub orders related to the main order
router.get('/sub/:id', verifyToken, authorize(["admin"]), async (req, res) => {
    const mainOrder = req.params.id;
    try {
        const order = await SubOrder.find({mainOrder});
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ order });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch sub order ' });
    }
});

// GET order details by order ID
router.get('/details/:id', verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// GET only the last order number for a specific user
router.get("/number", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const lastOrder = await Order.findOne({ user: req.user.id }) // Get only the latest order
            .sort({ createdAt: -1 }) // Sort by most recent
            .select("orderNumber totalPrice") // Select only orderNumber and totalPrice fields
            .exec();

        if (!lastOrder) {
            return res.status(404).json({ message: "No order found for this user" });
        }

		res.status(200).json({ 
            orderNumber: lastOrder.orderNumber, 
            totalPrice: lastOrder.totalPrice 
        });
	} catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET orders for a user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.put("/status/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, orderId, productId} = req.body;

        // Find the order and ensure you are updating the right order
        // const order = await SubOrder.findById({ _id: id});

        const order = await SubOrder.findOneAndUpdate(
            { _id: orderId, "orderItems._id": id }, // Find order containing the item
            { $set: { "orderItems.$.status": status } }, // Update the status of the matched item
            { new: true } // Return the updated document
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found or not assigned to you." });
        }

        order.isReceived = true;
        const result = await order.save();

        const product = await Product.findById(productId);
        product.salesCount += 1;
        product.popularityScore = calculatePopularityScore(product);
        await product.save();
        
        
        if (status === "completed") {
            const product = await Product.findById(productId);
            product.salesCount += 1;
            product.popularityScore = calculatePopularityScore(product);
            await product.save();

            const user = await User.findById(req.user.id);
            let purchaseHistory = user.purchaseHistory.filter(id => id.toString() !== productId);
            purchaseHistory.unshift(productId); // Add new product at the start
            purchaseHistory = purchaseHistory.slice(0, 6); // Keep only the last 6 items
            await User.findByIdAndUpdate(req.user.id, { purchaseHistory: purchaseHistory }, { new: true });
            
        }

        // const productItem = result.orderItems.find(item => item._id.toString() === id);

        const customer = await User.findById(result.orderedBy.toString());
        const contact = getContactType(customer.contact);
        if (contact) {
            const message = `The current state of your order is: ${status}.`;
            
            // Send Email
            if (contact.type === "email") {
                await sendEmail(contact.email, `Order Status: ${status}`, message);
            }

            // Send WhatsApp Message
            if (contact.phone) {
                await sendWhatsAppMessage(contact.phone, message);
            }
            
            // Push Notification (Optional)
            // sendPushNotification(sellerId, message);
        }
        
        res.json({ message: "Order updated successfully!", status: status });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating order." });
    }
});

// GET Orders Received by the Logged-in User
router.get("/received-orders", async (req, res) => {
    try {
        const userId = req.user.id;
        const receivedOrders = await Order.find({ receivedBy: userId }).populate("items.productId");

        res.json(receivedOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching received orders" });
    }
});


function getContactType(contact) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{7,15}$/; // Supports international numbers
    
    if (emailPattern.test(contact)) {
        return {
			type: "email",
			email: contact
		};
    } else if (phonePattern.test(contact)) {
		return {
			type: "phone",
			phone: contact
		};
    } else {
        return "invalid contact";
    }
}


module.exports = router;
