// routes/orders.js
import express from "express"
import Order from '../models/order.js'
import Product from '../models/product.js'
import Seller from "../models/seller.js"
// const SubOrder = require('../models/order');
import User from '../models/users.js'
import { verifyToken, authorize } from "../middleware/auth.js"
import crypto from 'crypto'
import sendEmail from "../utils/sendEmail.js"
import calculatePopularityScore from '../utils/calculatePopularityScore.js'

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

		// const mainOrder = new Order({
		// 	orderNumber: generateOrderNumber(), 
		// 	orderedBy: req.user.id,
		// 	totalPrice,
		// 	pickupStation: deliveryAddress.pickupStation
		// });

        // await mainOrder.save();

        // Group items by seller
        const sellerOrders = {};
        orderItems.forEach(item => {
            if (!sellerOrders[item.seller]) {
                sellerOrders[item.seller] = [];
            }
            sellerOrders[item.seller].push(item);
        });

        let savedOrders = []
        // Create sub-orders for each seller
        for (const seller in sellerOrders) {
            const newOrder = new Order({
                orderNumber: generateOrderNumber(), 
				receivedBy: seller,
                orderedBy: req.user.id,
				deliveryAddress,
				paymentDetails,
                orderItems: sellerOrders[seller],
                totalPrice: sellerOrders[seller].reduce((sum, item) => sum + item.price * item.quantity, 0),
                subTotal: sellerOrders[seller].reduce((sum, item) => sum + item.price * item.quantity, 0),
                trackingNumber: `TRK${Date.now()}${seller}`
            });

            savedOrders = await newOrder.save();


			const sellerData = await User.findById(seller);
			const contact = getContactType(sellerData.contact);
            if (contact) {
                const message = `New order placed! Order Number: ${newOrder.orderNumber}. Please check your seller dashboard.`;
                
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


        res.status(201).json({ message: "Order placed successfully", orderNumber: savedOrders.orderNumber });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Order processing failed" });
    }
});

// GET orders for a specific user
router.get('/myOrders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({orderedBy: req.user.id})         
        .sort({ createdAt: -1 }) // Sort by newest first
        .populate("receivedBy", "_id name")
        
        if (!orders) return res.status(404).json({ error: 'Order not found' });
        res.json({ orders });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch order ' });
    }
});

router.get('/', verifyToken, authorize(["admin"]), async (req, res) => {
    try {
        const orders = await Order.find()          
        .sort({ createdAt: -1 }) // Sort by newest first
        .populate("orderedBy", "name") // Get customer name
        
        if (!orders) return res.status(404).json({ error: 'Order not found' });
        res.json({ orders });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch order ' });
    }
});

// Get orders placed for a specifice user
router.get('/user/orderPlaced', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Order.find({"orderedBy": userId})          
        .sort({ createdAt: -1 }) // Sort by newest first
        .populate("orderedBy", "name") // Get customer name
        
        if (!orders) return res.status(404).json({ error: 'Order not found' });
        res.json({ orders });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch order ' });
    }
});

// Get orders reveived by a specifice user
router.get('/user/orderReceived', verifyToken, async (req, res) => {
    try {

        const userId = req.user.id;
        const seller = await Seller.findOne({
            user: userId,
            status: "Approved", // Ensure the seller is approved
        });
        if (!seller) return res.status(403).json({ message: 'Access denied. Seller is not approved.'});

        const orders = await Order.find({"receivedBy": userId})          
        .sort({ createdAt: -1 }) // Sort by newest first
        .populate("orderedBy", "name") // Get customer name
        
        if (!orders) return res.status(404).json({ error: 'Order not found' });
        res.json({ orders });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch order ' });
    }
});


// GET order details by order ID
router.get('/details/:orderId', verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const {orderId} = req.params;
    const order = await Order.findById({_id: orderId})
    .populate("orderedBy", "_id, name")
    .populate("receivedBy", "_id, name");

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ order });
  } catch (error) {
    console.log(error)
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

router.put("/status", verifyToken, async (req, res) => {
    try {
        const { status, orderId, products, orderedBy} = req.body;

        // Find the order and ensure you are updating the right order
        const order = await Order.findById(orderId); // Find order containing the item

        if (!order) {
            return res.status(404).json({ message: "Order not found or not assigned to you." });
        }

        // Ensure only seller can change product status
        if (req.user.id !== order.receivedBy.toString()) {
            return res.status(403).json({ message: "Unauthorized Access!" });
        }

        order.status = status;
        const result = await order.save();
       
        if (status === "completed") {

            for (const product of products) {
                const productId = product.product;
                const gottenProduct = await Product.findById(productId);
                gottenProduct.salesCount += 1;
                gottenProduct.countInStock -= product.quantity;
                gottenProduct.popularityScore = calculatePopularityScore(gottenProduct);
                await gottenProduct.save();

                // update buyer purchase history
                const purchaser = await User.findById(orderedBy);
                let purchaseHistory = purchaser.purchaseHistory.filter(id => id.toString() !== productId);
                purchaseHistory.unshift(productId); // Add new product at the start
                purchaseHistory = purchaseHistory.slice(0, 6); // Keep only the last 6 items
                await User.findByIdAndUpdate(orderedBy, { purchaseHistory: purchaseHistory }, { new: true });

                // update seller sales history
                const seller = await User.findById(req.user.id);
                let salesHistory = seller.salesHistory.filter(id => id.toString() !== productId);
                salesHistory.unshift(productId); // Add new product at the start
                salesHistory = salesHistory.slice(0, 6); // Keep only the last 6 items
                await User.findByIdAndUpdate(req.user.id, { salesHistory: salesHistory }, { new: true });
            }           
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
        }
        
        res.json({ message: "Order updated successfully!", status: status });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating order." });
    }
});

router.put("/tracking", verifyToken, async (req, res) => {
    try {
        const { status, orderId} = req.body;

        // Find the order and ensure you are updating the right order
        const order = await Order.findById(orderId); // Find order containing the item

        if (!order) {
            return res.status(404).json({ message: "Order not found or not assigned to you." });
        }

        // Ensure only seller can change product status
        if (req.user.id !== order.receivedBy.toString()) {
            return res.status(403).json({ message: "Unauthorized Access!" });
        }

        order.tracking = status;
        const result = await order.save();
       
        const customer = await User.findById(result.orderedBy.toString());
        const contact = getContactType(customer.contact);
        if (contact) {
            const message = `The current state of your order is: ${status}.`;
            
            // Send Email
            if (contact.type === "email") {
                await sendEmail(contact.email, `Order Status: ${status}`, message);
            }
        }
        
        res.json({ message: "Order updated successfully!", status: status });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating order." });
    }
});

router.put("/paymentConfirmation", verifyToken, async (req, res) => {
    try {
        const {orderId} = req.body;

        // Find the order and ensure you are updating the right order
        const order = await Order.findById( { _id: orderId});

        if (!order) {
            return res.status(404).json({ message: "Order not found or not assigned to you." });
        }

        // Ensure only seller can change product payment status
        if (req.user.id !== order.receivedBy.toString()) {
            return res.status(403).json({ message: "Unauthorized Access!" });
        }
        

        if (order.paymentStatus === "pending") {
            order.paymentStatus = "paid";
            await order.save();

        } else {
            order.paymentStatus = "pending";
            await order.save();
        }

        const customer = await User.findById(order.orderedBy.toString());
        const contact = getContactType(customer.contact);
        if (contact) {
            const message = `The current status of your Payment is: ${order.paymentStatus}.`;
            
            // Send Email
            if (contact.type === "email") {
                await sendEmail(contact.email, `Order Status: ${order.paymentStatus}`, message);
            }

        }
        
        res.json({ message: "Payment updated successfully!", status: order.paymentStatus });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error updating order." });
    }
});

router.put("/deliveryConfirmation", verifyToken, async (req, res) => {
    try {
        const {orderId} = req.body;

        // Find the order and ensure you are updating the right order
        const order = await Order.findById( { _id: orderId});


        if (!order) {
            return res.status(404).json({ message: "Order not found or not assigned to you." });
        }

        // Ensure only seller can change product payment status
        if (req.user.id !== order.orderedBy.toString()) {
            return res.status(403).json({ message: "Unauthorized Access!" });
        }

        order.isReceived = true;        
        await order.save();



        const customer = await User.findById(order.receivedBy.toString());
        const contact = getContactType(customer.contact);
        if (contact) {
            const message = `The current status of your Payment is: ${order.paymentStatus}.`;
            
            // Send Email
            if (contact.type === "email") {
                await sendEmail(contact.email, `Order Status: ${order.paymentStatus}`, message);
            }

        }
        
        res.json({ message: "Payment updated successfully!", status: order.paymentStatus });
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

// GET recent orders
router.get("/recentOrders", verifyToken, async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(10) // Limit to 10 recent orders
            .populate("orderedBy", "name") // Get customer name
            .populate("orderItems.product", "name price") // Get product details
            .lean();

        res.json(recentOrders);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch recent orders" });
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


export default router;
