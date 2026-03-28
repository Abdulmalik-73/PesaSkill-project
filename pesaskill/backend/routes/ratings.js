const express = require('express');
const Rating = require('../models/Rating');
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/ratings — Submit rating after job completion
router.post('/', protect, async (req, res) => {
  try {
    const { transactionId, rating, comment } = req.body;
    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.buyer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only buyer can rate' });
    if (tx.status !== 'released')
      return res.status(400).json({ message: 'Complete the job first' });

    const existing = await Rating.findOne({ transaction: transactionId });
    if (existing) return res.status(400).json({ message: 'Already rated' });

    const r = await Rating.create({
      service: tx.service,
      transaction: transactionId,
      buyer: req.user._id,
      seller: tx.seller,
      rating,
      comment,
    });

    // Update service rating average
    const serviceRatings = await Rating.find({ service: tx.service });
    const avgService = serviceRatings.reduce((a, b) => a + b.rating, 0) / serviceRatings.length;
    await Service.findByIdAndUpdate(tx.service, {
      rating: Math.round(avgService * 10) / 10,
      totalRatings: serviceRatings.length,
    });

    // Update seller rating average
    const sellerRatings = await Rating.find({ seller: tx.seller });
    const avgSeller = sellerRatings.reduce((a, b) => a + b.rating, 0) / sellerRatings.length;
    await User.findByIdAndUpdate(tx.seller, {
      rating: Math.round(avgSeller * 10) / 10,
      totalRatings: sellerRatings.length,
    });

    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/ratings/service/:serviceId
router.get('/service/:serviceId', async (req, res) => {
  try {
    const ratings = await Rating.find({ service: req.params.serviceId })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
