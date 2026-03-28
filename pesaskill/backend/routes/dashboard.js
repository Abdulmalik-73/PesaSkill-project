const express = require('express');
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard/seller
router.get('/seller', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const [transactions, services, user] = await Promise.all([
      Transaction.find({ seller: userId })
        .populate('service', 'title category price')
        .populate('buyer', 'name')
        .sort({ createdAt: -1 }),
      Service.find({ seller: userId, isActive: true }),
      User.findById(userId),
    ]);

    const totalEarnings = transactions
      .filter(t => t.status === 'released')
      .reduce((sum, t) => sum + t.sellerAmount, 0);

    const activeJobs = transactions.filter(t =>
      ['in_escrow', 'in_progress', 'completed'].includes(t.status)
    );
    const completedJobs = transactions.filter(t => t.status === 'released');

    res.json({
      totalEarnings,
      walletBalance: user.walletBalance,
      activeJobs,
      completedJobs,
      services,
      recentTransactions: transactions.slice(0, 10),
      stats: {
        totalOrders: transactions.length,
        completedOrders: completedJobs.length,
        rating: user.rating,
        totalRatings: user.totalRatings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/buyer
router.get('/buyer', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyer: req.user._id })
      .populate('service', 'title category price')
      .populate('seller', 'name rating')
      .sort({ createdAt: -1 });

    res.json({
      transactions,
      stats: {
        totalSpent: transactions.filter(t => t.status === 'released').reduce((s, t) => s + t.amount, 0),
        activeOrders: transactions.filter(t => ['in_escrow', 'in_progress', 'completed'].includes(t.status)).length,
        completedOrders: transactions.filter(t => t.status === 'released').length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/users/:id — public profile
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const services = await Service.find({ seller: req.params.id, isActive: true });
    res.json({ user, services });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
