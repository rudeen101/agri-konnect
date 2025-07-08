// routes/transactions.js
import express from "express"
const Transaction = require('../models/transaction');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST create a transaction
router.post('/', verifyToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }
    const newTransaction = new Transaction({
      user: req.user.userId,
      order: orderId,
      amount,
      status: 'completed' // For example, set to completed (in real scenarios, may use payment gateway callbacks)
    });
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// GET transactions for a user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    // Ensure the user can only fetch their own transactions (unless admin)
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const transactions = await Transaction.find({ user: req.params.userId }).sort({ transactionDate: -1 }).lean();
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET transaction details by ID
router.get('/:transactionId', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId).lean();
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    // Ensure that either the owner or an admin is accessing the transaction
    if (req.user.userId !== transaction.user.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transaction details' });
  }
});

export default router;
