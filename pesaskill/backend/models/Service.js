const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  category: {
    type: String,
    required: true,
    enum: ['Design', 'Coding', 'Writing', 'Marketing', 'Video', 'Music', 'Business', 'Other'],
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  ordersCompleted: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  deliveryDays: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
