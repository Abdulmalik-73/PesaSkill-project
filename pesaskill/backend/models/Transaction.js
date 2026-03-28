const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 }, // 5% commission
  sellerAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending_payment', 'in_escrow', 'in_progress', 'completed', 'released', 'disputed', 'refunded', 'cancelled'],
    default: 'pending_payment',
  },
  mpesaTransactionId: { type: String, default: '' },
  mpesaReceiptNumber: { type: String, default: '' },
  buyerPhone: { type: String, required: true },
  escrowReleasedAt: { type: Date },
  autoReleaseAt: { type: Date }, // 48h auto-release
  disputeReason: { type: String, default: '' },
  sellerNote: { type: String, default: '' },
  buyerConfirmed: { type: Boolean, default: false },
  sellerMarkedDone: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
