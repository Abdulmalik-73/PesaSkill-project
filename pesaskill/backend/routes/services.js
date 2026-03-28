const express = require('express');
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/services — browse marketplace with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category && category !== 'All') query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    let sortObj = { createdAt: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'popular') sortObj = { ordersCompleted: -1 };

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .populate('seller', 'name rating jobsCompleted isVerified')
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ services, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/trending
router.get('/trending', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('seller', 'name rating isVerified')
      .sort({ ordersCompleted: -1, rating: -1 })
      .limit(6);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/ai-recommend?category=Design&userId=xxx
router.get('/ai-recommend', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    const services = await Service.find(query)
      .populate('seller', 'name rating isVerified')
      .sort({ rating: -1, ordersCompleted: -1 })
      .limit(4);
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/price-suggest?category=Design
router.get('/price-suggest', async (req, res) => {
  try {
    const { category } = req.query;
    const services = await Service.find({ category, isActive: true });
    if (!services.length) return res.json({ suggested: 500, min: 100, max: 2000 });
    const prices = services.map(s => s.price);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    res.json({
      suggested: Math.round(avg),
      min: Math.round(avg * 0.9),
      max: Math.round(avg * 1.1),
      sampleSize: prices.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('seller', 'name rating jobsCompleted isVerified bio skills createdAt');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, price, category, tags, deliveryDays } = req.body;
    const service = await Service.create({
      title, description, price, category, tags, deliveryDays,
      seller: req.user._id,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/services/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Not found' });
    if (service.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/services/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Not found' });
    if (service.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await Service.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Service removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
